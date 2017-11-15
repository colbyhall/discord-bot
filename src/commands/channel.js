const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

const Guilds = require('../models/guild');

module.exports = {
    name: 'channel',
    category: 'moderation',
    help: '`;channel purpose(audit, welcome, rules)` to set current channel to that purpose\n`;channel purpose(audit, welcome, rules) channel` to set that channel to that purpose',
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
            
            let channel = message.channel;
            if (args[1]) {
                let otherChannel = message.guild.channels.find((channel) => {
                    return channel.toString() == args[1];
                });

                if (otherChannel) {
                    channel = otherChannel;
                }
            }

            if (args[0] == 'audit') {
                guild.channels.audit = channel.id;
                guild.save();
                embed.setDescription(`Audit channel has been set to ${channel.toString()}`);
                
                message.channel.send({embed});
            }
            else if (args[0] == 'welcome') {
                guild.channels.welcome = channel.id;
                guild.save();
                embed.setDescription(`Welcome channel has been set to ${channel.toString()}`);
                
                message.channel.send({embed});
            }
            else if(args[0] == 'rules') {
                guild.channels.rules = channel.id;
                guild.save();
                embed.setDescription(`Rules channel has been set to ${channel.toString()}`);
                
                message.channel.send({embed});
            }
            else {
                utils.getCommands().get('help').execute(message, new Array(this));
            }
        });

        return true;
    }
}