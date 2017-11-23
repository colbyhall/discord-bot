const { Guild } = require('discord.js');
const { CreativeClient, MusicPlayer, ClientModes } = require('../types');
const { GuildData, ProfileData } = require('../models');
const utils = require('../util');
const { config } = require('../util/config');
/**
 * @param { CreativeClient } client 
 * @param { Guild } guild
 */
module.exports = async (client, guild) => {

    // if (client.mode !== ClientModes.SHIPPING) return;

    GuildData.findOne({id: guild.id}, (err, guildData) => {
        if (!guildData) {
            GuildData.create({id: guild.id, prefix: ';', setupComplete: false});
        }
    });

    for (const member of guild.members.array()) {
        ProfileData.findOne({id: member.id}, (err, profile) => {

            if (!profile) {
                ProfileData.create({id: member.id});
            }
            else {
                profile.guilds.push({id: guild.id});

                profile.save();
            }

        });
    }

    const home = client.guilds.get(config.homeServer);

    if (home) {
        const botMember = home.members.get(client.user.id);
        utils.auditMessage(botMember, `Bot added to ${guild.name}`);
    }


    client.musicPlayers.set(guild.id, new MusicPlayer(guild));
}