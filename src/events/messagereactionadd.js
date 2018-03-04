const { MessageReaction, User } = require('discord.js');
const { CreativeClient } = require('../types');
const utils = require('../util');

/**
 * This is called when a reaction is added to a message
 * @param { CreativeClient } client 
 * @param { MessageReaction } messageReaction
 * @param { User } user
 */
module.exports = async (client, messageReaction, user) => {


    return;
    /**
     * Get this servers musicplayer
     */
    const musicPlayer = client.musicPlayers.get(messageReaction.message.guild.id);
    
    /**
     * If we're not in a vc this stop execution
     */
    if (!musicPlayer.voiceConnection || messageReaction.emoji.name != 'upvote') return;

    const memberCount = client.channels.get(musicPlayer.voiceConnection.channel.id).members.array().length;

    /**
     * All of this is broken
     */
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