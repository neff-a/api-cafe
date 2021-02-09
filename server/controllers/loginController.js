
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

app.post('/login', function(request, response) {

    let userRequest = request.body;

    User.findOne({ email: userRequest.email, status: 'ACT' }, (error, userDB) => {

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

        let userResponse = _.pick(userDB, ['name', 'email', 'status']);

        let token = jwt.sign({
            user: userResponse
          }, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

        return response.json({
            token
        })
    });

});

module.exports = app    