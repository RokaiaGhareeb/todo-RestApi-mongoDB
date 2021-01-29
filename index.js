var inspector = require('inspector');

//create and connect to database
require('./db-connection');

//extract models
const User = require('./models/user');

//create server
const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const todoRoute = require('./routers/todoRouter');
const userRoute = require('./routers/userRouter');

app.use('/api/todo', todoRoute);
app.use('/api/user', userRoute);

//logger
app.use((req, res, next) => {
    console.log(`Request Url : ${req.url}, Request method : ${req.method}, Date of Request: ${Date()}`);
    next();
  });

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
});
