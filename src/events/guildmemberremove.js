const { GuildMember } = require('discord.js');
const { CreativeClient, ClientModes } = require('../types');
const utils = require('../util');

/**
 * This is called when a user leaves the guild
 * @param { CreativeClient } client 
 * @param { GuildMember } member
 */
module.exports = async (client, member) => {

    /**
     * Don't go past this point if we're not in shipping mode
     */
    if (client.mode !== ClientModes.SHIPPING) return;

    /**
     * Tell the guild that they left
     */
    utils.auditMessage(member, `Has left`);

}