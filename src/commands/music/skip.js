const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'skip',
    category: 'music',
    help: '`;skip` skips current song',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        if (!args.musicPlayer.voiceConnection) {
            return false;
        }

        if (utils.canUse(message.member, this) && !args[0]) {
            const embed = utils.getEmbed();
    
            embed.setTitle(`Song Skipped: ${args.musicPlayer.get().title}`)
            embed.setDescription(`Forced by ${message.author.toString()}\n${args.musicPlayer.get().url}`);
            
            message.channel.send({embed});
            args.musicPlayer.skip();
            return false;
        }
        else {
            const memberCount = message.channel.guild.channels.get(args.musicPlayer.voiceConnection.channel.id).members.array().length;

            if (!args.musicPlayer.skipMessage && memberCount > 3 || (args[0] && args[0] == 'request')) {
                const embed = utils.getEmbed();

                embed.setTitle(`Song Skipped: ${args.musicPlayer.get().title}`)
                embed.setDescription(`Requested by ${message.author.toString()}\n${args.musicPlayer.get().url}`);
                embed.setImage(args.musicPlayer.get().thumbnail)
    
                command.message.channel.send({embed}).then(message =>
                {
                    message.requestor = message.author;
                    args.musicPlayer.skipMessage = message;
                    message.react(client.emojis.find('name', 'upvote'));
                });
            }
            else if (memberCount <= 3) {
                const embed = utils.getEmbed();
    
                embed.setTitle(`Song Skipped: ${args.musicPlayer.get().title}`)
                embed.setDescription(`Requested by ${message.author.toString()}\n${args.musicPlayer.get().url}`);
                embed.setImage(args.musicPlayer.get().thumbnail);
                
                message.channel.send({embed});
                args.musicPlayer.skip();
                return false;
            }
            else {
                message.reply('skip in progress');
            }
        }
        args.musicPlayer.textChannel = message.channel.id;
    
        return false;
    }
}