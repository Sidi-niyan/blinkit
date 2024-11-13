const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURL)
    .then(function() {
        console.log("Connected to MongoDB");
    })
    .catch(function(err) {
        console.error("Error connecting to MongoDB:", err);
    });

module.exports = mongoose.connection;