const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;
const GuildMember = Discord.GuildMember;

const utils = require('../utils');

module.exports = {
    name: 'play',
    category: 'music',
    help: '`;play keywords` search youtube with keywords\n`;play index` use index after a search',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        if (args.length == 0) {
            utils.getCommands().get('help').execute(message, new Array(this.name));
            return false;
        }

        args.musicPlayer.textChannel = message.channel.id;

        /**
         * @type {GuildMember}
         */
        const guildMember = message.channel.guild.members.get(message.author.id);

        if (guildMember.voiceChannel && guildMember.voiceChannel.joinable) {
            guildMember.voiceChannel.join().then((connection) => {
                args.musicPlayer.voiceConnection = connection;

                if (args.musicPlayer.searchResults) {
                    const index = parseInt(args[0], 10);

                    if (index != NaN && args.musicPlayer.searchResults.length > 0 && index <= args.musicPlayer.searchResults.length) {
                        
                        if (args.musicPlayer.queue.length === 0) {
                            let embed = utils.getEmbed();
                            embed.setTitle('Music Added');
                            embed.setDescription(`[${args.musicPlayer.searchResults[index].title}](${args.musicPlayer.searchResults[index].url})\nRequested by ${message.author.toString()}`);
                            embed.setImage(args.musicPlayer.searchResults[index].thumbnail);
                            
                            message.channel.send({embed});
                        }
                        args.musicPlayer.searchResults = null;
                        args.musicPlayer.add(args.musicPlayer.searchResults[index]);

                        return false;
                    }
                    else {
                        args.musicPlayer.searchResults = null;
                    }
                }

                utils.youtubeSearch(args.toString(), message.channel.guild.members.get(message.author.id), (musicData) => {
                    if (musicData.error === '') {
                        if (args.musicPlayer.queue.length != 0) {
                            let embed = utils.getEmbed();
                            embed.setTitle('Music Added');
                            embed.setDescription(`[${musicData.results[0].title}](${musicData.results[0].url})\nRequested by ${message.author.toString()}`);
                            embed.setImage(musicData.results[0].thumbnail);
                            message.channel.send({embed});
                        }

                        args.musicPlayer.add(musicData.results[0]);
                    }
                });
            });
        }

        return false;
    }
}