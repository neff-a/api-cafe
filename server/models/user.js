
const mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;

let rolesEnum = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid ROLE'
}

const User = new Schema({
    name: { 
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: [true, 'el email es requerido'],
        unique: true
    },
    password: { 
        type: String,
        required: true
    },
    img:{
        type: String
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesEnum
    },
    status:{
        type: String,
        default: 'ACT'
    },
    has_google_account:{
        type: Boolean,
        default: false
    },
});

User.plugin(uniqueValidator, { message: 'Error, expected {PATH} must be unique.' });


module.exports = mongoose.model('User', User)
  