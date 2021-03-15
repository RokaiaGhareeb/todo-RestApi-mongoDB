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
      const todolist = await TodoList.create({ userId: req.signedData.id, title, listItems = []});
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
        { $push: { listItems : { title, done } } }
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
      const todolists = await TodoList.find({ userId : req.signedData.id }).exec();
      res.statusCode = 200;
      res.send(todolists);
  
    } catch (error) {
      res.statusCode = 422;
      res.send({ message: 'not found' });
  
    }
  });
