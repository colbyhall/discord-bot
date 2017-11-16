const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util/utils');
const GuildData = require('../../models/guild');

module.exports = {
    name: 'channel',
    category: 'moderation',
    help: '`;channel <purpose>` to set current channel to that purpose\n'
        + '`;channel <purpose> <channel>` to set that channel to that purpose',
    example: '`;channel audit #audit`',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.member, this)) return false;
        
        const embed = utils.getEmbed();

        GuildData.findOne({id: message.guild.id}, (err, guild) => {

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
                utils.executeCommandHelp(message, this);
            }
        });

        return true;
    }
}