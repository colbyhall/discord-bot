const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

module.exports = {
    name: 'help',
    category: 'General',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        
        if (args.length > 0) {
            let searchCommand = utils.getCommands().get(args[0]);
            let embed = utils.getEmbed();
            if (searchCommand && utils.canUse(message.author, searchCommand)) {
                embed.setTitle(searchCommand.name);
                embed.setDescription(searchCommand.help);

                message.channel.send({embed});
            }
            else {
                let commands = utils.getCommands().filter((command) => {
                    return command.category == args[0] && utils.canUse(message.author, command);
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
            let embed = utils.getEmbed();
            
            embed.setTitle('Help Commands');
            embed.setDescription('`;help` can also be used as `;help command` or `;help category`');
            const commands = utils.getCommands().array();

            for (const command of commands) {
                if (command.name != this.name && utils.canUse(message.author, this)) {
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