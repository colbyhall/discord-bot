const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');

module.exports = {
    name: 'queue',
    category: 'music',
    help: '`;queue` gets current song queue',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        const embed = utils.getEmbed();
    
        if (args.musicPlayer.queue.length == 0) {
            embed.setDescription('Nothing has been queued');
            message.channel.send({embed});
            return false;
        }
        
        for (let i = 0; i < args.musicPlayer.queue.length; i++) {
            let title = '';
            if (i == 0) {
                title = `Currently Playing: ${args.musicPlayer.queue[i].title}`;
                if (args.musicPlayer.queue.length == 1)
                {
                    embed.setImage(args.musicPlayer.queue[i].thumbnail);
                }
            }
            else {
                title = `${i + 1}: ${args.musicPlayer.queue[i].title}`;
            }
            embed.addField(title, `Requested from ${args.musicPlayer.queue[i].requestor.toString()}`);
        }
        
        message.channel.send({embed});

        return false;
    }
}