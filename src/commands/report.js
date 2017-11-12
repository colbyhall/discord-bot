const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

module.exports = {
    name: 'report',
    category: 'moderation',
    help: '`;report type message` type can be anything from bot bugs to server recommendations. \nAny false reports or report spam will lead to a ban',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (args.length > 2) {
            utils.auditMessage(message.author, `Reported "${args[0]}"\n${args.toString(1)}`, true);
        }
        else {
            utils.getCommands().get('help').execute(message, new Array(this.name));
        }
    
        return false;
    }
}