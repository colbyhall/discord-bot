const { GuildMember } = require('discord.js');
const { CreativeClient, ClientModes } = require('../types');
const { GuildData, ProfileData } = require('../models');
const utils = require('../util');

/**
 * This is called when someone joins a guild that the bot is in
 * @param { CreativeClient } client 
 * @param { GuildMember } member
 */
module.exports = async (client, member) => {

    /**
     * Debug should't even mess with this
     */
    if (client.mode == ClientModes.DEBUG) return;

    /**
     * Setup the profile data for this user
     */
    GuildData.findOne({id: member.guild.id}, (err, guild) => {
        if (!guild || !guild.channels || !guild.channels.welcome) return;

        if (guild.mode !== client.mode) return;

        ProfileData.findOne({id: member.id}, (err, profile) => {
            if (!profile) {
                ProfileData.create({
                    id: member.id, 
                    guilds: [{id: message.guild.id}]
                });
                return;
            }
    
            profile.guilds.push({id: message.guild.id});
    
            profile.save();
        });

        /**
         * Shoot a message to the welcome channel saying that the user joined
         */
        const welcomeChannel = member.guild.channels.get(guild.channels.welcome);

        if (guild.channels.rules) {
            const ruleChannel = member.guild.channels.get(guild.channels.rules);
            
            if (welcomeChannel && ruleChannel) {
                welcomeChannel.send(`Welcome ${member.toString()} to ${member.guild.name}! Please read the ${ruleChannel.toString()} before moving to the community channels.`);
                
                return;
            }
        }

        if (welcomeChannel) {
            welcomeChannel.send(`Welcome ${member.toString()} to ${member.guild.name}!`);
        }
    });
}