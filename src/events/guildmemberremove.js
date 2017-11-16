const { GuildMember } = require('discord.js');
const { CreativeClient, ClientModes } = require('../types');
const utils = require('../util/utils');

/**
 * @param { CreativeClient } client 
 * @param { GuildMember } member
 */
module.exports = async (client, member) => {
    if (client.mode === ClientModes.DEBUG)
    {
        return;
    }
    utils.auditMessage(member, `Left...`);
}