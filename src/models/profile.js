const mongoose = require('mongoose');

let profileSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    guilds: [{
        id: {
            type: String,
            required: true
        },
        mutes: [{type: String, required: true}],
        warnings: [{
            reason: String,
            date: {
                type: Date,
                default: Date.now
            }
        }],
        kicks: [{
            reason: String,
            date: {
                type: Date,
                default: Date.now
            }
        }],
        bans: [{
            reason: String,
            date: {
                type: Date,
                default: Date.now
            }
        }],
        rank: {
            level: {
                type: Number,
                default: 1
            },
            notify: {
                type: Boolean,
                default: true
            },
            lastMessageTime: Date
        },
        meta: {
            messages: {
                type: Number,
                default: 0
            },
            words: {
                type: Number,
                default: 0
            },
            mentions: {
                type: Number,
                default: 0
            },
            joinedDate: {
                type: Date,
                default: Date.now
            }
        }
    }]
}, { collection: 'profiles' });

let profile = module.exports = mongoose.model('Profile', profileSchema);