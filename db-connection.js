//connect to monogdb

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://rokaia-admin:${process.env.password}@cluster0.huvkw.mongodb.net/todo`, { useFindAndModify: false }, (err)=>{
    if(err){
      console.error(err);
      process.exit(1);
    }
    console.info('db-connection succssefuly');
});