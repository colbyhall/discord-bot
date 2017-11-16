const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/creative-logic', {useMongoClient: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', err => {
    console.log(err);
});

module.exports = db;