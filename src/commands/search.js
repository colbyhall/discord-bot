const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

module.exports = {
    name: 'search',
    category: 'music',
    help: '`;seach keywords` to search Youtube for songs and return them in a list',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Proimise<Boolean>}
     */
    async execute(message, args) {
        if (args.length == 0){
            utils.getCommands().get('help').execute(message, new Array(this.name));
            return false;
        }
    
        utils.youtubeSearch(args.toString(), message.author, (musicData) => {
            if (musicData.error == '') {
                let embed = utils.getEmbed();
                embed.setTitle('Search Results');
                for (let i = 0; i < musicData.results.length; i++)
                {
                    embed.addField(`${i + 1}: ${musicData.results[i].title}`, musicData.results[i].url);
                }
                args.musicPlayer.searchResults = musicData.results;
                message.channel.send({embed});
            }
        });
        
        return false;
    }
}