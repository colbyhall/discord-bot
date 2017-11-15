const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

const Profiles = require('../models/profile');

module.exports = {
    name: 'unmute',
    category: 'moderation',
    help: '`;unmute @user` to unmute that user',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

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
            SEND_MESSAGES: true
        });

        return true;
    }
}