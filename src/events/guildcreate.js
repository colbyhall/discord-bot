const { Guild } = require('discord.js');
const { CreativeClient, MusicPlayer } = require('../types');
const { GuildData, ProfileData } = require('../models');
const utils = require('../util');
/**
 * @param { CreativeClient } client 
 * @param { Guild } guild
 */
module.exports = async (client, guild) => {
    GuildData.findOne({id: guild.id}, (err, guildData) => {
        if (!guildData) {
            GuildData.create({id: guild.id, prefix: ';', setupComplete: false});
        }
    });

    for (const member of guild.members.array()) {
        ProfileData.findOne({id: member.id}, (err, profile) => {

            if (!profile) {
                ProfileData.create({
                    id: member.id,
                    guilds: [{
                        id: guild.id,
                        meta: {joinedDate: Date.now()}
                    }]
                });
            }
            else {
                profile.guilds.push({
                    id: guild.id,
                    meta: {joinedDate: Date.now(), messages: 0, mentions: 0, words: 0}
                });

                profile.save();
            }

        });
    }

    client.musicPlayers.set(guild.id, new MusicPlayer(guild));
}