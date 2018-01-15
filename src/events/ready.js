const { CreativeClient, MusicPlayer, ClientModes } = require('../types');
const { GuildData, ProfileData } = require('../models')
const { config } = require('../util/config');
/**
 * This is called when the bot is finally logged in
 * @param {CreativeClient} client 
 */
module.exports = async (client) => {
    /**
     * Setting up a music player for each guild
     */
    for (let guild of client.guilds.array()) {
        client.musicPlayers.set(guild.id, new MusicPlayer(guild));
    }

    /**
     * Adding guilds that bot are logged into that are not in the db
     */
    for (const guild of client.guilds.array()) {
        GuildData.findOne({id: guild.id}, (err, guildData) => {
            if (!guildData) {
                GuildData.create({id: guild.id});
            }

            /**
             * Log the guild data for each server
             */
            console.log(guildData);
        });
    }

    /**
     * Caching Messages
     */
    for(let channel of client.channels.array()) {
        if (channel && channel.type === 'text') {
            channel.messages.fetch();
        }
    }
   
    /**
     * Returns if the bot is not in debug mode
     */
    if (client.mode !== ClientModes.DEBUG) {
        return;
    }
    
    /**
     * Message that is sent when ready
     */
    const channel = client.channels.get(config.channels.testing);
    if (channel) {
        channel.send('Ready :)');
    }
}