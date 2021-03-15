const express = require('express');

const mongoose = require('mongoose');

const Todo = require('../models/todo');

const todoRoute = express.Router();

const auth = require('../midlewares/auth');

module.exports = todoRoute;

todoRoute.use(auth);

//add new todo
todoRoute.post('/', async (req, res) => {
  const { title, status, body } = req.body;
  try {
    const todo = await Todo.create({ userId: req.signedData.id, title, body, status});
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
todoRoute.patch('/edit/:id', async(req, res) => {
  try {
    const userId = req.signedData.id;
    const _id = req.params.id;
    const { title, body} = req.body;
    const editedTodo = await Todo.updateOne({userId, _id},{title, body});
    res.statusCode = 200;
    res.send({ title, body });
  } catch (err) {
    res.statusCode = 422;
    res.send({message: 'edit failed'});
  }
});

//change todo status
todoRoute.patch('/changestatus/:id', async(req, res) => {
  try {
    const userId = req.signedData.id;
    const _id = req.params.id;
    const { status } = req.body;
    const editedTodo = await Todo.updateOne({userId, _id},{status});
    res.statusCode = 200;
    res.send({ status });
  } catch (err) {
    res.statusCode = 422;
    res.send({message: 'change failed'});
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