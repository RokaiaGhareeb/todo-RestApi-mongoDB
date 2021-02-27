const express = require('express');

const mongoose = require('mongoose');

const TodoList = require('../models/todolist');

const todolistRoute = express.Router();

const auth = require('../midlewares/auth');

module.exports = todolistRoute;

todolistRoute.use(auth);
