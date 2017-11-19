const mongoose = require('mongoose');

let profileSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    guilds: [{
        id: String,
        mutes: [{
            channelId: String
        }],
        warnings: [{
            reason: String,
            date: Date
        }],
        kicks: [{
            reason: String,
            date: Date
        }],
        bans: [{
            reason: String,
            date: Date
        }],
        rank: {
            level: Number,
            notify: Boolean,
            lastMessageTime: Date
        },
        meta: {
            messages: Number,
            words: Number,
            mentions: Number,
            joinedDate: Date
        }
    }]
}, { collection: 'profiles' });

let profile = module.exports = mongoose.model('Profile', profileSchema);