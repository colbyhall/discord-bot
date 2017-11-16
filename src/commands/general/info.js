const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util/utils');

const moment = require('moment');

module.exports = {
    name: 'info',
    category: 'general',
    help: '`;info` gets general info about the bot like ping and such',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        const embed = utils.getEmbed();

        embed.setThumbnail(message.client.user.avatarURL());
        embed.addField('Ping', `${Math.trunc(message.client.ping)} ms`);

        const ms = message.client.uptime;
        let time = `${ms}ms`;
        const seconds = Math.trunc((ms / 1000) % 60);
        if (seconds > 0) {
            time = `${seconds} ${seconds > 1 ? 'seconds' : 'second'}`;
        }
        const minutes = Math.trunc((ms / (1000 * 60)) % 60);
        if (minutes > 0) {
            time = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
        }
        const hours = Math.trunc((ms / (1000 * 60 * 60)) % 24);
        if (hours > 0) {
            time = `${hours} ${hours > 1 ? 'hours' : 'hour'}`;
        }
        const days = Math.trunc(ms / (1000 * 60 * 60 * 24))
        if (days > 0) {
            time = `${hours} ${days > 1 ? 'days' : 'day'}`;
        }

        embed.addField('Uptime', time);

        message.channel.send({embed});

        return false;
    }
}