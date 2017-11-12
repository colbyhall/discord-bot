const mongoose = require('mongoose');

let guildSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    channels: {
        audit: String,
        welcome: String,
        rules: String
    },
    prefix: String
})

let guild = module.exports = mongoose.model('Guild', guildSchema);