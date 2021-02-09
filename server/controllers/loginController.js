const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

app.post('/login', function(request, response) {

    let userRequest = request.body;

    User.findOne({ email: userRequest.email }, (error, userDB) => {

        if(error) {
            return response.status(500).json({
                code: 500,
                message: 'Internal server error',
                error
            })
        }

        if (!userDB) {
            return response.status(400).json({
                code: 400,
                message: '(User) or password are not valid'
            })
        }

        let matchPassword = bcrypt.compareSync(userRequest.password, userDB.password)

        if (!matchPassword) {
            return response.status(400).json({
                code: 400,
                message: 'User or (password) are not valid'
            })
        }

        return response.json({
            user: userDB,
            token: 'xxx-xxx-xxx'
        })
    });

});

module.exports = app    