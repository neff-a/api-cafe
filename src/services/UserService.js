const bcrypt = require('bcrypt');
const _ = require('underscore');
const { validateToken, validateAdminRole } = require('../api/middlewares/authentication');
const User = require('../models/user');


class UserService {

    async save(userRequest) {

        let user = new User({
            name: userRequest.name,
            email: userRequest.email,
            password: bcrypt.hashSync(userRequest.password, 10),
            role: userRequest.role
        });
        try {
            return await user.save();
        } catch(error) {
            throw error
        }
    }

}

module.exports = UserService