const mongoose = require('mongoose');

const schema = mongoose.Schema({
    
        username : {
            type: String,
            required: true,
            unique: true
        },
        password:{
            type : String,
            required: true
        },
        fname:{
            type: String,
            minLength: 3,
            maxLength: 15,
            require : true
        },
        age:{
            type: Number,
            min : 13,

        }

}, {timestamps: true});

const User = mongoose.model("User", schema);

module.exports = User;
