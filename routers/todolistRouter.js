const express = require('express');

const mongoose = require('mongoose');

const TodoList = require('../models/todolist');

const todolistRoute = express.Router();

const auth = require('../midlewares/auth');

module.exports = todolistRoute;

todolistRoute.use(auth);

//add new todolist
todolistRoute.post('/', async (req, res) => {
    const { title } = req.body;
    try {
        const todolist = await TodoList.create({ userId: req.signedData.id, title, listItems: [] });
        res.statusCode = 200;
        res.send(todolist);
    } catch (err) {
        res.statusCode = 422;
        res.send({ success: false });
    }
});

//add new item to the list
todolistRoute.post('/item/:id', async (req, res) => {
    const id = req.params.id;
    const { title, done } = req.body;
    try {
        const todolist = await TodoList.updateOne(
            { _id: id },
            { $push: { listItems: { title, done } } }
        );
        res.statusCode = 200;
        res.send(todolist);
    } catch (err) {
        res.statusCode = 422;
        res.send({ success: false });
    }
});

// get all todoLists
todolistRoute.get('/', async (req, res) => {
    try {
        const todolists = await TodoList.find({ userId: req.signedData.id }).exec();
        res.statusCode = 200;
        res.send(todolists);

    } catch (error) {
        res.statusCode = 422;
        res.send({ message: 'not found' });

    }
});

// get  a todolist
todolistRoute.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const todolists = await TodoList.find({ userId: req.signedData.id, _id: id }).exec();
        res.statusCode = 200;
        res.send(todolists);

    } catch (error) {
        res.statusCode = 422;
        res.send({ message: 'not found' });

    }
});

//delete a todolist
todolistRoute.delete('/:id', async (req, res) => {
    try {
        const userId = req.signedData.id;
        const id = req.params.id;
        await TodoList.deleteOne({ userId: userId, _id: id });
        res.statusCode = 200;
        res.send({ message: 'todolist deleted' });
    } catch (err) {
        res.statusCode = 422;
        res.send({ message: 'deletion falied' });
    }
});

//delete a todolist's item
todolistRoute.delete('/item/:listid/:itemid', async (req, res) => {
    const listid = req.params.listid;
    const itemid = req.params.itemid;
    try {
        const todolist = await TodoList.updateOne(
            { _id: listid },
            { $pull: { listItems: { _id: itemid } } }
        );
        res.statusCode = 200;
        res.send(todolist);
    } catch (err) {
        res.statusCode = 422;
        res.send({ success: false });
    }
});

//change status of an item done or not done
todolistRoute.patch('/changestatus/:listid/:itemid', async (req, res) => {
    try {
        const userId = req.signedData.id;
        const listid = req.params.listid;
        const itemid = req.params.itemid;
        const { done } = req.body;
        const editedTodoList = await TodoList.updateOne(
            {
                _id: listid,
                userId,
                "listItems._id": itemid
            },
            { $set: { 'listItems.$.done': done } }
        );
        res.statusCode = 200;
        res.send({ done });
    } catch (err) {
        res.statusCode = 422;
        res.send({ message: 'change failed'});
    }
});