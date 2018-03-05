const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'colby',
    category: 'general',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        
        message.channel.send('https://gyazo.com/81c35b71c805724f1c2b1ed9f44f8968');

        return false;
    }
}