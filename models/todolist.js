const mongoose = require('mongoose');

const schema = new mongoose.Schema({
        userId: String,
        title: {
            type : String,
            required: true,
            minlength:10,
            maxlength: 20
        },
        listItems: [{
            title: {
                type: String,
                required: true,
                minlength : 5
            },
            done: Boolean
        }]
        
},
{timestamps: true});

const TodoList = mongoose.model('TodoList', schema);

module.exports  =  TodoList;