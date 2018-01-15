const { GuildMember } = require('discord.js');
const { CreativeClient } = require('../types');
const utils = require('../util');

/**
 * This is called when the bot joins or leaves a voice channel
 * @param { CreativeClient } client 
 * @param { GuildMember } oldMember
 * @param { GuildMember } newMember
 */
module.exports = async (client, oldMember, newMember) => {

    /**
     * Lets get the music player
     */
    const musicPlayer = client.musicPlayers.get(oldMember.guild.id);

    /**
     * If theres not voice connection then stop executing
     */
    if (!musicPlayer.voiceConnection) return;

    /**
     * Get the member count and if we're the only one in there leave the channel
     */
    let memberCount = client.channels.get(musicPlayer.voiceConnection.channel.id).members.array().length;

    if (memberCount == 1) musicPlayer.clear();
}