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

        let ms = message.client.uptime;
        let time = `${ms}ms`;
        const seconds = Math.trunc((ms / 1000) % 60);
        if (seconds > 0) {
            time = `${seconds} ${seconds > 1 ? 'seconds' : 'second'}`;
            return;
        }
        const minutes = Math.trunc((ms / (1000 * 60)) % 60);
        if (minutes > 0) {
            time = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
            return;
        }
        const hours = Math.trunc((ms / (1000 * 60 * 60)) % 24);
        if (hours > 0) {
            time = `${hours} ${hours > 1 ? 'hours' : 'hour'}`;
            return;
        }
        const days = Math.trunc(ms / (1000 * 60 * 60 * 24))
        if (days > 0) {
            time = `${hours} ${days > 1 ? 'days' : 'day'}`;
            return;
        }

        embed.addField('Uptime', time);

        message.channel.send({embed});

        return false;
    }
}