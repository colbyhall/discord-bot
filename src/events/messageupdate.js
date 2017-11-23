const { Message } = require('discord.js');
const { CreativeClient, ClientModes } = require('../types');
const utils = require('../util');

/**
 * @param { CreativeClient } client 
 * @param { Message } oldMessage
 * @param { Message } newMessage
 */
module.exports = async (client, oldMessage, newMessage) => {
    if (client.mode === ClientModes.DEBUG) {
        return;
    }

    if (oldMessage.author.bot || (oldMessage.content === '' && newMessage.content === '') || oldMessage.content === newMessage.content) {
        return;
    }

    GuildData.findOne({id: member.guild.id}, (err, guild) => {
        if (guild.mode !== client.mode) return;
        
        utils.auditMessage(message.member, `Changed "${oldMessage.content}" to "${newMessage.content}" in ${newMessage.channel.toString()}`);
    });
}