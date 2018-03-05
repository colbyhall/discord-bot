const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'sivert',
    category: 'general',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        
        message.channel.send({
            files: ['https://dl.dropboxusercontent.com/s/38we8m6rg3sq28k/image.png']
        });

        return false;
    }
}