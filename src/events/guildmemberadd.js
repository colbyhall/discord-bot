const { GuildMember } = require('discord.js');
const { CreativeClient, ClientModes } = require('../types');
const { GuildData, ProfileData } = require('../models');
const utils = require('../util/utils');

/**
 * @param { CreativeClient } client 
 * @param { GuildMember } member
 */
module.exports = async (client, member) => {
    if (client.mode === ClientModes.DEBUG) {
        return;
    }

    GuildData.findOne({id: member.guild.id}, (err, guild) => {
        if (!guild || !guild.channels || !guild.channels.welcome) return;

        let welcomeChannel = member.guild.channels.get(guild.channels.welcome);

        if (guild.channels.rules) {
            let ruleChannel = member.guild.channels.get(guild.channels.rules);
            
            if (welcomeChannel && ruleChannel) {
                welcomeChannel.send(`Welcome ${member.toString()} to ${member.guild.name}! Please read the ${ruleChannel.toString()} before moving to the community channels.`);
                
                return;
            }
        }

        if (welcomeChannel) {
            welcomeChannel.send(`Welcome ${member.toString()} to ${member.guild.name}!`);
        }
    });

    ProfileData.findOne({id: member.id}, (err, profile) => {
        if (!profile) {
            ProfileData.create({id: member.id, guilds: [message.guild.id]});
            return;
        }

        profile.guilds.push(member.guild.id);
        profile.save();
    });
}