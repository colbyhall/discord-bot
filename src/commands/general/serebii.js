const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'serebii',
    category: 'general',
    help: '`;serebii` to meme',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        const quotes = [
            'kill all jews'
        ]

        message.channel.send('you is a gay');

        return false;
    }
}