const { Guild } = require('discord.js');
const { CreativeClient, MusicPlayer, ClientModes } = require('../types');
const { GuildData, ProfileData } = require('../models');
const utils = require('../util');
const { config } = require('../util/config');
/**
 * This is called when the bot joins a guild
 * @param { CreativeClient } client 
 * @param { Guild } guild
 */
module.exports = async (client, guild) => {
    
    /**
     * Add a new music player for this guild
     */
    client.musicPlayers.set(guild.id, new MusicPlayer(guild));

    /**
     * Don't do the rest if the bot is not in shipping
     */
    if (client.mode !== ClientModes.SHIPPING) return;

    /**
     * Look to see if we've been in this bot before and if not then add it to our db
     */
    GuildData.findOne({id: guild.id}, (err, guildData) => {
        if (err) console.error(err);

        if (!guildData) GuildData.create({id: guild.id});
    });

    /**
     * Loop through members.
     * If they're not in our db then add them to the db and make sure this guild is listed for them
     * If they're in our db then add this guild to their list of guilds
     */
    for (const member of guild.members.array()) {
        ProfileData.findOne({id: member.id}, (err, profile) => {

            if (!profile) {
                ProfileData.create({id: member.id});
            } else {
                profile.guilds.push({id: guild.id});

                profile.save();
            }

        });
    }

    /**
     * Get our home guild.
     */
    const home = client.guilds.get(config.homeServer);

    /**
     * If the home guild is valid then shoot a message in the audit channel
     */
    if (home) {
        const botMember = home.members.get(client.user.id);
        utils.auditMessage(botMember, `Bot added to ${guild.name}`);
    }

}