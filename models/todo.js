const mongoose = require('mongoose');

const schema = new mongoose.Schema({
        userId: String,
        title: {
            type : String,
            required: true,
            minlength:10,
            maxlength: 20
        },
        body:{
            type: String,
            required: true,
            minlength: 10,
            maxlength: 500
        },
        status:{
            type : String,
            enum : ["todo", "inprogress", "done"],
            required: true
        },
        tags:{
            type: [String],
            maxlength: 10
        },
        
},
{timestamps: true});

const Todo = mongoose.model('Todo', schema);

module.exports  =  Todo;