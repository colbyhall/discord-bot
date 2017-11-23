const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

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
            utils.executeCommandHelp(message, this);
            return false;
        }
    
        utils.youtubeSearch(args.toString(), message.author, (err, data) => {
            if (!err) {
                const embed = utils.getEmbed();
                embed.setTitle('Search Results');
                for (let i = 0; i < data.length; i++)
                {
                    embed.addField(`${i + 1}: ${data[i].title}`, data[i].url);
                }
                args.musicPlayer.searchResults = data;
                message.channel.send({embed});
            }
        });
        
        return false;
    }
}