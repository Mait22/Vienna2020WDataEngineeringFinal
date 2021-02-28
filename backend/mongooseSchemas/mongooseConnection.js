const mongoose = require("mongoose");

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = {
    mongoose
}

    