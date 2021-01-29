//connect to monogdb

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todo', { useFindAndModify: false }, (err)=>{
    if(err){
      console.error(err);
      process.exit(1);
    }
    console.info('db-connection succssefuly');
});