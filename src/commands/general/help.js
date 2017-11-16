const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util/utils');

module.exports = {
    name: 'help',
    category: 'general',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        
        if (args.length > 0) {
            const searchCommand = utils.getCommands().get(args[0]);
            const embed = utils.getEmbed();
            if (searchCommand && utils.canUse(message.author, searchCommand)) {
                embed.setTitle(searchCommand.name);
                embed.setDescription(searchCommand.help);

                message.channel.send({embed});
            }
            else {
                const commands = utils.getCommands().filter((command) => {
                    return command.category == args[0] && utils.canUse(message.guild, command);
                }).array();
                
                if (commands.length > 0)
                {
                    embed.setTitle(`${args[0].firstLetterToUpperCase()} Commands`)

                    for (const command of commands) {
                        embed.addField(command.name, command.help);
                    }

                    message.channel.send({embed});
                }
            }
        }
        else {
            const embed = utils.getEmbed();
            
            embed.setTitle('Help Commands');
            embed.setDescription('`;help` can also be used as `;help command` or `;help category`');
            const commands = utils.getCommands().array();

            for (const command of commands) {
                if (command.name != this.name && utils.canUse(message.member, this)) {
                    embed.addField(command.name, command.help);
                }
            }

            message.author.createDM().then((channel) => {
                channel.send({embed});
            });

            message.reply('we sent you a DM with all of our amazing commands');
        }

        return false;
    }
}