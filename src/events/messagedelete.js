const { Message } = require('discord.js');
const { CreativeClient, ClientModes } = require('../types');
const utils = require('../util');

/**
 * @param {CreativeClient} client 
 * @param {Message} message
 */
module.exports = async (client, message) => {
    if (client.mode === ClientModes.DEBUG) {
        return;
    }

    if (message.content === '') {
        return;
    }

    GuildData.findOne({id: member.guild.id}, (err, guild) => {
        if (guild.mode !== client.mode) return;

        utils.auditMessage(message.member, `Removed "${message.content}" from ${message.channel.toString()}`);
    });

}