const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util/utils');
const ProfileData = require('../../models/profile');

module.exports = {
    name: 'unmute',
    category: 'moderation',
    help: '`;unmute <user>` to unmute that user',
    example: '`;unmute @Colby`',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.member, this)) return;

        if (!args[0]) {
            utils.executeCommandHelp(message, this);
            return;
        }

        const member = message.guild.members.find((member) => {
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