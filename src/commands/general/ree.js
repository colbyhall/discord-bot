const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util/utils');

module.exports = {
    name: 'ree',
    category: 'laugh',
    help: '`;ree` to meme',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        message.channel.send({
            files: ['https://media.discordapp.net/attachments/329329501945331712/376505116993257475/4564575466.gif']
        });

        return false;
    }
}