const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'purge',
    category: 'moderation',
    help: '`;purge <1-100>` removes message from channel command is used in',
    example: ';purge 69',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.member, this)) {
            return false;
        }
        
        if (args.length == 0) {
            utils.executeCommandHelp(message, this);
            return false;
        }
        
        const messagesToDelete = parseInt(args[0], 10);
        
        if (messagesToDelete < 1 || messagesToDelete > 100) {
            utils.executeCommandHelp(message, this);
            return false;
        }

        if (messagesToDelete == 100) {
            messagesToDelete -= 1;
        }

        message.channel.bulkDelete(messagesToDelete + 1);

        return true;

    }
}