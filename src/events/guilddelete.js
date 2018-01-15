const { Guild } = require('discord.js');
const { CreativeClient, MusicPlayer, ClientModes } = require('../types');
const { GuildData, ProfileData } = require('../models');
const utils = require('../util');
const { config } = require('../util/config');
/**
 * This is called when someone removes the bot
 * @param { CreativeClient } client 
 * @param { Guild } guild
 */
module.exports = async (client, guild) => {

    /**
     * If we're not in shipping then don't do this
     */
    if (client.mode !== ClientModes.SHIPPING) return;

    const home = client.guilds.get(config.homeServer);

    if (home) {
        const botMember = home.members.get(client.user.id);
        utils.auditMessage(botMember, `Bot removed from ${guild.name}`);
    }
}