const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

module.exports = {
    name: 'prefix',
    category: 'moderation',
    help: '`;prefix new` Sets new to the prefix',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.author, this)) return;
        
        let embed = utils.getEmbed();
        
        Guilds.findOne({id: message.guild.id}, (err, guild) => {
            
            if (!guild) return;

            embed.setAuthor(message.guild.name, message.guild.iconURL());
            
            if (args[0]) {
                guild.prefix = args[0];
                
                guild.save();
                embed.setDescription(`Prefix has been set to ${args[0]}`);
                message.channel.send({embed});
            }
            else {
                utils.getCommands().get('help').execute(message, new Array(this));
            }
        });
            
        return args[0];
    }
}