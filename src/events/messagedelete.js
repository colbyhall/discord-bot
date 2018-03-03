const { Message } = require('discord.js');
const { CreativeClient, ClientModes } = require('../types');
const utils = require('../util');

/**
 * This is called when a message is deleted from a guild the bot is in
 * @param {CreativeClient} client 
 * @param {Message} message
 */
module.exports = async (client, message) => {

    /**
     * Debug mode should just not do this
     */
    if (client.mode === ClientModes.DEBUG) return;

    /**
     * This is to prevent discord with spamming us with false negatives
     */
    if (message.content === '') return;
    
    utils.auditMessage(message.member, `Removed "${message.content}" from ${message.channel.toString()}`);

}