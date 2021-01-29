const express = require('express');

const mongoose = require('mongoose');

const Todo = require('../models/todo');

const todoRoute = express.Router();

const auth = require('../midlewares/auth');

module.exports = todoRoute;

todoRoute.use(auth);

//add new todo
todoRoute.post('/', async (req, res) => {
  const { title, status, tags, body } = req.body;
  try {
    const todo = await Todo.create({ userId: req.signedData.id, title, body, status, tags });
    res.statusCode = 200;
    res.send(todo);
  } catch (err) {
    res.statusCode = 422;
    res.send({ success: false });
  }
});

//return all todos   
todoRoute.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId : req.signedData.id }).exec();
    res.send(todos);
    res.statusCode = 200;

  } catch (error) {
    res.send({ message: 'not found' });
    res.statusCode = 422;

  }
});

//get a specific todd using todo-id
todoRoute.get('/:id', async(req, res) =>{
  try {
    const userId = req.signedData.id;
    const id = req.params.id;
    const todo = await Todo.findOne({userId:userId, _id:id});
    res.send({todo : todo});
    res.statusCode = 200;
  } catch (err) {
    res.send({message: 'not dound'});
    res.statusCode = 401;
  }
});

//delete a todo
todoRoute.delete('/:id', async(req, res) =>{
  try {
    const userId = req.signedData.id;
    const id = req.params.id;
    await Todo.deleteOne({userId:id, _id:id});
    res.send({message : 'todo deleted'});
    res.statusCode = 200;
  } catch (err) {
    res.send({message: 'deletion falied'});
    res.statusCode = 422;
  }
});

//edit todo
todoRoute.patch('/:id', async(req, res) => {
  try {
    const userId = req.signedData.id;
    const _id = req.params.id;
    const { title, body, tags, status} = req.body;
    const editedTodo = await Todo.updateOne({userId, _id},{title, body, tags, status });
    console.log(editedTodo);
    res.send({editedTodo: editedTodo});
    res.statusCode = 200;
  } catch (err) {
    res.send({message: 'edit failed'});
    res.statusCode = 422;
  }
});