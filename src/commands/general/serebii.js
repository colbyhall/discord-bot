const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'serebii',
    category: 'general',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        
        message.channel.send({
            files: ['https://pbs.twimg.com/media/DXZrLVZWsAABtrV.jpg']
        });

        return false;
    }
}