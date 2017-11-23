const mongoose = require('mongoose');
const { ClientModes, BlackListActions } = require('../types');
const { config } = require('../util/config');

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
    prefix: {
        type: String,
        default: config.prefix
    },
    mode: {
        type: String,
        default: ClientModes.SHIPPING
    },
    setupComplete: {
        type: Boolean,
        default: false
    },
    rankSystem: {
        exponential: {
            type: Number,
            default: 256
        },
        pointsDelay: {
            type: Number,
            default: (1000 * 60)
        },
        roleAtLevel: [{level: {
            type: Number,
            required: true
        }, role: {
            type: String,
            required: true
        }}]
    },
    blacklist: {
        words: [{type: String, required: true}],
        action: {
            type: Number,
            default: BlackListActions.AUDIT
        }
    },
    commands: [{name: String, roles: [String], enabled: Boolean}],
    tempBans: [{id: String, time: Date}],
}, { collection: 'guilds' });

module.exports = mongoose.model('Guild', guildSchema);