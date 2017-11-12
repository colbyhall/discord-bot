const mongoose = require('mongoose');

let profileSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    guilds: [],
    warnings: [{reason: String, date: Date, guildId: String}],
    ranks: [{guildId: String, rank: Number, notify: Boolean}]
}, { collection: 'profiles' });

let profile = module.exports = mongoose.model('Profile', profileSchema);