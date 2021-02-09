
const jwt = require('jsonwebtoken');

const validateToken = (request, response, next) => {

    let tokenRequest = request.get('Authorization');

    if (!tokenRequest || tokenRequest.length < 10) {
        return response.status(401)
            .json({
                code: 401,
                message: 'unauthorized'
            })
    }

    let token  = tokenRequest.slice(7)

    jwt.verify(token, process.env.SECRET_TOKEN, (error, jwtData) => {

        if (error) {
            return response.status(401)
                .json({
                    code: 401,
                    message: 'unauthorized'
                })
        
        }
        request.user_session = jwtData.user;
        next();
    });

    

};

module.exports = {
    validateToken
}


