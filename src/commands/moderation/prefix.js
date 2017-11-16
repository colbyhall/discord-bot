const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util/utils');
const GuildData = require('../../models/guild');

module.exports = {
    name: 'prefix',
    category: 'moderation',
    help: '`;prefix <new>` Sets new to the prefix',
    example: '`;prefix /`',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.member, this)) return;

        const embed = utils.getEmbed();
        
        GuildData.findOne({id: message.guild.id}, (err, guild) => {
            
            if (!guild) return;

            embed.setAuthor(message.guild.name, message.guild.iconURL());
            
            if (args[0]) {
                guild.prefix = args[0];
                
                guild.save();
                embed.setDescription(`Prefix has been set to ${args[0]}`);
                message.channel.send({embed});
            }
            else {
                utils.executeCommandHelp(message, this);
            }
        });
            
        return args[0] != null;
    }
}