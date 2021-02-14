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
        email:{
            type: String,
            required : true,
        }

}, {timestamps: true});

const User = mongoose.model("User", schema);

module.exports = User;
