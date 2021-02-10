require('./config')

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const { dbConnection } = require('./database/mongodb')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            users: '/api/users'
        }
        this.connectDatabase();
        this.middlewares();
        this.routes();

    }

    async connectDatabase() {
        await dbConnection();
    }

    middlewares() {
        // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: false }))
         
        // parse application/json
        this.app.use(bodyParser.json());
        
        // static page
        this.app.use(express.static(path.resolve(__dirname, '../public')));
    }

    routes() {
        this.app.use(require('./api/controllers'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('server running on port ', this.port);
        })
    }

}

const server = new Server();
server.listen();