const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

const Guilds = require('../models/guild');

module.exports = {
    name: 'guild',
    category: 'moderation',
    help: '`;guild` gets current data about the guild\n`;guild prefix string` sets the guilds prefix\n`;guild channel (audit, welcome, rules)` sets that channel to be one of those three channels',
    roles: [
        "369607830413639680",
        "369662679473848320",
        "369615751906066433"
    ],
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
                if (args[0] == 'prefix' && args[1]) {
                    guild.prefix = args[1];
                    

                    embed.setDescription(`Prefix has been set to ${args[1]}`);

                    message.channel.send({embed});
                }
                else if (args[0] == 'channel' && args[1]) {

                    if (args[1] == 'audit') {
                        guild.channels.audit = message.channel.id;
                        guild.save();
                        embed.setDescription(`Audit channel has been set to ${message.channel.toString()}`);
                        
                        message.channel.send({embed});
                    }
                    else if (args[1] == 'welcome') {
                        guild.channels.welcome = message.channel.id;
                        guild.save();
                        embed.setDescription(`Welcome channel has been set to ${message.channel.toString()}`);
                        
                        message.channel.send({embed});
                    }
                    else if(args[1] == 'rules') {
                        guild.channels.rules = message.channel.id;
                        guild.save();
                        embed.setDescription(`Rules channel has been set to ${message.channel.toString()}`);
                        
                        message.channel.send({embed});
                    }
                    else {
                        utils.getCommands().get('help').execute(message, new Array(this));
                    }

                }
                else {
                    utils.getCommands().get('help').execute(message, new Array(this));
                }
            }

        })


        return false;
    }
}