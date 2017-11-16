const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util/utils');

module.exports = {
    name: 'report',
    category: 'moderation',
    help: '`;report <type> <message>` type can be anything from bot bugs to server recommendations. \n'
        + 'Any false reports or report spam will lead to a ban',
    example: ';report bullying @Colby\'s bot keeps on picking on me',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (args.length > 2) {
            utils.auditMessage(message.member, `Reported "${args[0]}"\n${args.toString(1)}`, true);
        }
        else {
            utils.executeCommandHelp(message, this);
        }
    
        return false;
    }
}