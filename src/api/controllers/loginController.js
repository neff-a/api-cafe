
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../../models/user');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

        let userResponse = _.pick(userDB, ['name', 'email', 'role']);

        let token = jwt.sign({
            user: userResponse
          }, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

        return response.json({
            token
        })
    });

});

async function verify(id_token) {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.CLIENT_ID
    });
    const googleUser = ticket.getPayload();

    return {
        name: googleUser.name,
        email: googleUser.email,
        img: googleUser.picture
    }
  }

app.post('/google-sign-in', async (request, response) => {
    let tokenRequest = request.body;
    let googleUser = await verify(tokenRequest.idtoken).catch((err) => {
        return response.status(403).json({
            code: 403,  
            error: err
        })
    });
    User.findOne({email: googleUser.email}, (error, userDB) => {
        
        if (error) {
            return response.status(500).json({
                code: 500,
                error
            })
        }

        if (userDB == null) {
            let user = new User();
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.name = googleUser.name;
            user.has_google_account = true;
            user.password = '- - -';

            user.save((error, newUserDB) => {
                if (error) {
                    return response.status(500).json({
                        code: 500,
                        error
                    })
                }

                let userResponse = _.pick(newUserDB, ['name', 'email', 'role']);

                let token = jwt.sign({
                    user: userResponse
                }, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

                return response.json({
                    token
                })
            })
        } else if (userDB.has_google_account) {

            let userResponse = _.pick(userDB, ['name', 'email', 'role']);

            let token = jwt.sign({
                user: userResponse
            }, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

            return response.json({
                token
            });

        } else {
            return response.status(403).json({
                code: 403,
                message: 'Forbidden operation, google account not verified'
            })
        }

    });    

});

module.exports = app    