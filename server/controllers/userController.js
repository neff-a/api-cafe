const express = require('express');
const app = express();
const { validateToken, validateAdminRole } = require('../middlewares/authentication')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
  
    app.post('/users', [validateToken, validateAdminRole ], function (req, res) {
        
        const request  = req.body;
        
        let user = new User({
            name: request.name,
            email: request.email,
            password: bcrypt.hashSync(request.password, 10),
            role: request.role
        });

        user.save((err, user) => {
            if (err) {
                res.status(400).json({
                    code: 400,
                    message: 'error on save',
                    error: err
                })
                return;
            }
            
            res.json({
                user
            })
        });
    })
    
    app.put('/users/:id', [validateToken, validateAdminRole], function (req, res) {
        
        const userId = req.params.id;
        const userRequest  = _.pick( req.body, ['name', 'email', 'role']);


        User.findByIdAndUpdate(userId, userRequest, {new: true, runValidators: true}, (err, user) => {

            if (err) {  

                res.status(400).json({
                    code: 400,
                    message: 'error on update',
                    error: err
                })
                return;
            }

            res.json({
                user
            })

        });
    });

    app.get('/users', validateToken, function (req, res) {
        
        const from = Number(req.query.from) || 0;
        const limit = Number(req.query.limit) || 10;
        

        User.find({'status': 'ACT'}, 'name role email img has_google_account')
            .skip(from)
            .limit(limit)
            .exec((err, users) => {

                if(err) {
                    return res.status(400).json({
                        code: 400,
                        message: 'error getting page of users',
                        error: err
                    })
                }

                User.countDocuments( {'status': 'ACT'}, (err, count) => {

                    if(err) {
                        return res.status(400).json({
                            code: 400,
                            message: 'error counting users',
                            error: err
                        })
                    }

                    res.json({
                        users,
                        total: count
                    })
                })


            });
    });

    app.delete('/users/:id', [validateToken, validateAdminRole] ,function (req, res) {
        
        const userId = req.params.id;
        const userRequest  = _.pick( req.body, ['status']);


        User.findByIdAndUpdate(userId, userRequest, { new: true }, (err, user) => {

            if (err) {  

                res.status(400).json({
                    code: 400,
                    message: 'error on update',
                    error: err
                })
                return;
            }

            res.json({
                user
            })

        });
    });
    
module.exports = app    