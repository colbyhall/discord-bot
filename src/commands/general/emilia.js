const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'emilia',
    category: 'general',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        
        message.channel.send({
            files: ['https://i.imgur.com/K9viAPi.jpg']
        });

        return false;
    }
}