const { Message } = require('discord.js');
const { CreativeClient, ClientModes } = require('../types');
const utils = require('../util');
const { GuildData } = require('../models');

/**
 * This is called when someone edits a message
 * @param { CreativeClient } client 
 * @param { Message } oldMessage
 * @param { Message } newMessage
 */
module.exports = async (client, oldMessage, newMessage) => {
    
    /**
     * Never do this when we're in debug mode
     */
    if (client.mode === ClientModes.DEBUG) return;

    /**
     * This prevents discord from spamming us with this event
     */
    if (oldMessage.author.bot || (oldMessage.content === '' && newMessage.content === '') || oldMessage.content === newMessage.content) return;

    /**
     * Check the client mode and make sure its the one this version is on
     */
    GuildData.findOne({id: oldMessage.guild.id}, (err, guild) => {

        // if (guild.mode !== client.mode) return;
        
        /**
         * Audit a message that someone changed a message
         */
        utils.auditMessage(oldMessage.member, `Changed "${oldMessage.content}" to "${newMessage.content}" in ${newMessage.channel.toString()}`);
    });
}