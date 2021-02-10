const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        console.log('connection db successfull')

    } catch (error) {
        throw new Error('connection db failed');
    }
}

module.exports = {
    dbConnection
}