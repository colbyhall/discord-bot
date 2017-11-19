const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'play',
    category: 'music',
    help: '`;play <keywords>` search youtube with keywords\n'
        + '`;play <index>` use index after a search',
    example: '`;play baby justin beiber`',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (args.length == 0) {
            utils.executeCommandHelp(message, this);
            return false;
        }

        args.musicPlayer.textChannel = message.channel.id;

        const guildMember = message.member;

        if (guildMember.voiceChannel && guildMember.voiceChannel.joinable) {
            guildMember.voiceChannel.join().then(connection => {
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
                        args.musicPlayer.add(args.musicPlayer.searchResults[index]);
                        args.musicPlayer.searchResults = null;

                        return false;
                    }
                    else {
                        args.musicPlayer.searchResults = null;
                    }
                }


                utils.youtubeSearch(args.toString(), message.member, (err, data) => {
                    if (!err) {
                        if (args.musicPlayer.queue.length != 0) {
                            let embed = utils.getEmbed();
                            embed.setTitle('Music Added');
                            embed.setDescription(`[${data[0].title}](${data[0].url})\nRequested by ${message.author.toString()}`);
                            embed.setImage(data[0].thumbnail);
                            message.channel.send({embed});
                        }

                        args.musicPlayer.add(data[0]);
                        return;
                    }
                });
            });
        }

        return false;
    }
}