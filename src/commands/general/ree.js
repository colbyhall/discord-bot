const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'ree',
    category: 'general',
    help: '`;ree` to meme',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (message.deletable) message.delete();

        message.channel.send({
            files: ['https://media.discordapp.net/attachments/329329501945331712/376505116993257475/4564575466.gif']
        });

        return false;
    }
}