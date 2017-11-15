const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

const Guilds = require('../models/guild');

module.exports = {
    name: 'guild',
    category: 'moderation',
    help: '`;guild` gets current data about the guild',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.author, this)) return false;
        
        let embed = utils.getEmbed();

        Guilds.findOne({id: message.guild.id}, (err, guild) => {

            if (!guild) return;

            embed.setAuthor(message.guild.name, message.guild.iconURL());
            
            if (args.length == 0) {
                embed.setDescription(`Prefix: '${guild.prefix}'`);

                if (guild.channels) {
                    if (guild.channels.welcome) {
                        embed.addField('Welcome Channel', message.guild.channels.get(guild.channels.welcome).toString());
                    }

                    if (guild.channels.rules) {
                        embed.addField('Rules Channel', message.guild.channels.get(guild.channels.rules).toString());
                    }

                    if (guild.channels.audit) {
                        embed.addField('Audit Channel', message.guild.channels.get(guild.channels.audit).toString());
                    }
                }

                message.channel.send({embed});

                return;
            }
            else {
                utils.getCommands().get('help').execute(message, new Array(this));
            }
        });


        return false;
    }
}