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
    prefix: String,
    commands: [{name: String, roles: [String], enabled: Boolean}],
    tempBans: [{id: String, time: Object}],
    systems: [{name: String, enabled: Boolean}]
}, { collection: 'guilds' });

module.exports = mongoose.model('Guild', guildSchema);