const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util/utils');

module.exports = {
    name: 'clear',
    category: 'music',
    help: '`;clear` clears the current song queue',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        if (args.musicPlayer.voiceConnection) {
            args.musicPlayer.clear();
        }

        args.musicPlayer.textChannel = message.channel.id;

        return false;
    }
}