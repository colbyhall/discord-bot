const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'bowen',
    category: 'general',
    help: '`;bowen` to meme',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (message.deletable) message.delete();

        message.channel.send({
            files: ['https://cdn.discordapp.com/attachments/419367755415027723/419367853830045713/bowen_fuck_you.png']
        });

        return false;
    }
}