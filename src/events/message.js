const { Message } = require('discord.js');
const { CreativeClient, ClientModes, Arguments, CommandType } = require('../types');
const { CommandHandler, RankHandler } = require('../modules');
const { ProfileData, GuildData } = require('../models')
const utils = require('../util');
const { config } = require('../util/config');

/**
 * This is called everytime a message is sent in a channel that the bot can see
 * @param {CreativeClient} client 
 * @param {Message} message
 */
module.exports = async (client, message) => {

    if (utils.shouldCheckMessage(client, message)) return;

    /**
     * Calls a seperate code modules that just handles parsing and executing commands
     */
    CommandHandler(client, message);
    
    /**
     * Handles updating meta data and rank system
     */
    RankHandler(client, message);
}