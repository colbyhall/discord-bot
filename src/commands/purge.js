const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

module.exports = {
    name: 'purge',
    category: 'moderation',
    help: '`;purge 1-100` removes message from channel command is used in',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.author, this)) {
            return false;
        }
        
        if (args.length == 0) {
            utils.getCommands().get('help').execute(message, new Array(this.name));
            return false;
        }
        
        const messagesToDelete = parseInt(args[0], 10);
        
        if (messagesToDelete < 1 || messagesToDelete > 100) {
            utils.getCommands().get('help').execute(message, new Array(this.name));
            return false;
        }

        if (messagesToDelete == 100) {
            messagesToDelete -= 1;
        }

        message.channel.bulkDelete(messagesToDelete + 1);

        return true;

    }
}