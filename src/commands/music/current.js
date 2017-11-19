const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'current',
    category: 'music',
    help: '`;current` gets current song ',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!args.musicPlayer.get()) {
            message.reply('Nothings playing dumb shit');
            return false;
        }
        
        const embed = utils.getEmbed();
        
        embed.setTitle(`Current Song: ${args.musicPlayer.get().title}`)
        embed.setDescription(`Requested by ${args.musicPlayer.get().requestor.toString()}\n${args.musicPlayer.get().url}`);
        embed.setImage(args.musicPlayer.get().thumbnail);

        message.channel.send({embed});
        return false;
    }
}