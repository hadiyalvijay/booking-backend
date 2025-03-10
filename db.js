const mongoose = require('mongoose');
require('dotenv').config()
const dbUrl = process.env.DB_URL || 'mongodb+srv://admin:admin07@cluster0.mer5k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectToMongo = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("DATABASE CONNECTED");
    }).catch(err => {
        console.error("OH NO ERROR!!!!", err.message);
    });
}


module.exports = connectToMongo;