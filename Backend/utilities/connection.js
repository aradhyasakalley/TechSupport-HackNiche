//Importing the modules
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

// Setting parameters
const connectionParameters = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Checking environment
let URI = process.env.MONGODB_URI_DEV;
if (process.env.ENVIRONMENT === 'prod') {
    URI = process.env.MONGODB_URI_PROD;
}

// Connecting to the database
const connection = mongoose.connect(URI, connectionParameters)
    .then(() => {
        console.log(`Connected to database ${process.env.ENVIRONMENT}`);
    })
    .catch((error) => {
        console.log(error);
    });

// exporting the module
module.exports = connection;