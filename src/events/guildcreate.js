const { Guild } = require('discord.js');
const { CreativeClient, MusicPlayer } = require('../types');
const { GuildData } = require('../models');
const utils = require('../util');
/**
 * @param { CreativeClient } client 
 * @param { Guild } guild
 */
module.exports = async (client, guild) => {
    GuildData.findOne({id: guild.id}, (err, guildData) => {
        if (!guildData) {
            GuildData.create({id: guild.id});
        }
    });

    client.musicPlayers.set(guild.id, new MusicPlayer(guild));
}