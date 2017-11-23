const { GuildMember } = require('discord.js');
const { CreativeClient, ClientModes } = require('../types');
const utils = require('../util');

/**
 * @param { CreativeClient } client 
 * @param { GuildMember } member
 */
module.exports = async (client, member) => {
    if (client.mode === ClientModes.DEBUG)
    {
        return;
    }

    GuildData.findOne({id: member.guild.id}, (err, guild) => {

        if (guild.mode !== client.mode) return;

        utils.auditMessage(member, `Left...`);
    });

}