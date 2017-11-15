const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

const Profiles = require('../models/profile');

module.exports = {
    name: 'mute',
    category: 'moderation',
    help: '`;mute @user` to mute that user',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.author, this)) return;

        if (!args[0]) {
            utils.getCommands().get('help').execute(message, [this.name]);
            return false;
        }

        let member = message.guild.members.find((member) => {
            return member.toString() === args[0];
        });

        if (!member) {
            message.reply('sorry we could not find that member');
            return false;
        }

        message.channel.overwritePermissions(member.user, {
            SEND_MESSAGES: false
        });

        Profiles.findOne({id: member.id}, (err, profile) => {
            profile.mutes.push({guildId: message.guild.id, channelId: message.channel.id});

            profile.save();
        });

        return true;
    }
}