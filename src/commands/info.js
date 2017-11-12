const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

const moment = require('moment');

module.exports = {
    name: 'info',
    category: 'General',
    help: '`;info` gets general info about the bot like ping and such',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        let embed = utils.getEmbed();

        embed.setThumbnail(message.client.user.avatarURL());
        embed.addField('Ping', `${message.client.ping} ms`);

        embed.addField('Uptime', `${message.client.uptime}ms`);

        message.channel.send({embed});

        return false;
    }
}