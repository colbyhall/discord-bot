const { MessageReaction, User } = require('discord.js');
const { CreativeClient } = require('../types');
const utils = require('../util/utils');

/**
 * @param { CreativeClient } client 
 * @param { MessageReaction } messageReaction
 * @param { User } user
 */
module.exports = async (client, messageReaction, user) => {

    const musicPlayer = client.musicPlayers.get(messageReaction.message.guild.id);
    
    if (!musicPlayer.voiceConnection || messageReaction.emoji.name != 'upvote') {
        return;
    }

    const memberCount = client.channels.get(musicPlayer.voiceConnection.channel.id).members.array().length;

    if (messageReaction.message.id === musicPlayer.skipMessage.id) {

        if (user.id === musicPlayer.skipMessage.requestor.id) {
            messageReaction.remove();
        }

        if (messageReaction.count > (memberCount - 1) / 2) {
            const embed = utils.getEmbed();

            embed.setTitle(`Skipped ${musicPlayer.get().title}`)
            embed.setDescription(musicPlayer.get().url);
            embed.setImage(musicPlayer.get().thumbnail);

            messageReaction.message.channel.send({embed});
            messageReaction.message.delete();
            musicPlayer.skip();
        }
    }
}