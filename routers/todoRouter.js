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
    res.statusCode = 200;
    res.send(todos);

  } catch (error) {
    res.statusCode = 422;
    res.send({ message: 'not found' });

  }
});

//get a specific todo using todo-id
todoRoute.get('/:id', async(req, res) =>{
  try {
    const userId = req.signedData.id;
    const id = req.params.id;
    const todo = await Todo.findOne({userId:userId, _id:id});
    res.statusCode = 200;
    res.send({todo : todo});
  } catch (err) {
    res.statusCode = 401;
    res.send({message: 'not dound'});
  }
});

//delete a todo
todoRoute.delete('/:id', async(req, res) =>{
  try {
    const userId = req.signedData.id;
    const id = req.params.id;
    await Todo.deleteOne({userId:userId, _id:id});
    res.statusCode = 200;
    res.send({message : 'todo deleted'});
  } catch (err) {
    res.statusCode = 422;
    res.send({message: 'deletion falied'});
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
    res.statusCode = 200;
    res.send({editedTodo: editedTodo});
  } catch (err) {
    res.statusCode = 422;
    res.send({message: 'edit failed'});
  }
});

// filter todos by status
todoRoute.get('/filter/:status', async(req, res) =>{
  try {
    const userId = req.signedData.id;
    const filteredTodos = await Todo.find({userId, status : req.params.status});
    console.log(filteredTodos);
    res.statusCode = 200;
    res.send(filteredTodos);
  } catch (err) {
    res.statusCode = 422;
    res.send({message: 'no todos found'});
  }
});