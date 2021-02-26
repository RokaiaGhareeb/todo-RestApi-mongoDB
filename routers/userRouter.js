const express = require('express');

const mongoose = require('mongoose');

const User = require('../models/user');

const Todo = require('../models/todo');

const userRoute = express.Router();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const auth = require('../midlewares/auth');

module.exports = userRoute;

//return all users   
userRoute.get('/', async(req, res) => {
  try {
    const users = await User.find({}, {password : 0}).exec();
    res.send(users);
    res.statusCode = 200;
  } catch (error) {
    res.statusCode = 422;
    res.send({message : 'error'});
  }
});

//sign up a user
userRoute.post('/', async (req, res) => {
  try {

    const { username, password, email } = req.body;
    const hash = await bcrypt.hash(password, 7);
    const user = await User.create({ username, password: hash, email });
    res.statusCode = 200;
    res.send({sucess: true, user});
  }
  catch(err) { 
    console.log(err);
    res.statusCode = 422;
    res.send({sucess: false, err});
  }
});

//login a user
userRoute.post('/login/', async(req, res) =>{
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username}).exec();
    if(!user) throw new Error({message : "wrong usename or password"});
    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched) throw new Error({message : "wrong usename or password"});
    const token = jwt.sign({id: user.id}, 'my-signing-secret');
      res.statusCode = 200;
      res.send({sucess: true, token : token});
  } catch (err) {
    console.log(err);
    res.send({sucess: false});
    res.statusCode = 422;
  }
});


userRoute.use(auth);


//delete a user using authentication token

userRoute.delete('/', async(req, res) =>{
  try {
    const id = req.signedData.id;
    await User.deleteOne({_id: id});
    await Todo.deleteMany({userId:id});
    res.send({message : 'user deleted'});
    res.statusCode = 200;
  } catch (err) {
    res.statusCode = 422;
    res.send({message: 'deletion falied'});
  }
});


//show user Profile and Todos
userRoute.get('/profile', async(req, res) =>{
  try {
    const id = req.signedData.id;
    const user = await User.findOne({_id: id}, {password : 0});
    const todos = await Todo.find({userId : id})
    res.statusCode = 200;
    res.send({user: user, todos : todos});
  } catch (error) {
    res.statusCode = 401;
    res.send({message :'user not found'});
  }
});

//edit user profile
userRoute.patch('/', async(req, res) => {
  try {
    const _id = req.signedData.id;
    const { username,  email } = req.body;
    const editedUser = await User.updateOne({_id}, {username, email});
    res.statusCode = 200;
    console.log(editedUser);
    res.send({username, email});
  } catch (err) {
    res.statusCode = 422;
    res.send({message: 'edit failed'});
  }
});