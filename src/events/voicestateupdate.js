const { GuildMember } = require('discord.js');
const { CreativeClient } = require('../types');
const utils = require('../util/utils');

/**
 * @param { CreativeClient } client 
 * @param { GuildMember } oldMember
 * @param { GuildMember } newMember
 */
module.exports = async (client, oldMember, newMember) => {
    const musicPlayer = client.musicPlayers.get(oldMember.guild.id);
    if (!musicPlayer.voiceConnection) {
        return;
    }

    let memberCount = client.channels.get(musicPlayer.voiceConnection.channel.id).members.array().length;

    if (memberCount == 1) {
        musicPlayer.clear();
    }
}