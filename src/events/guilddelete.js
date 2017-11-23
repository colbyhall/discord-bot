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

    if (client.mode !== ClientModes.SHIPPING) return;

    const home = client.guilds.get(config.homeServer);

    if (home) {
        const botMember = home.members.get(client.user.id);
        utils.auditMessage(botMember, `Bot removed from ${guild.name}`);
    }
}