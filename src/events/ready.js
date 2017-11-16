const CreativeClient = require('../types/creativeclient');
const MusicPlayer = require('../types/musicplayer');
const ClientModes = require('../types/clientmodes');
const { GuildData } = require('../models')
const { config } = require('../util/config');
/**
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
    GuildData.find((err, guilds) => {
        for (const guild of client.guilds.array()) {

            const data = guilds.find(guildData => {
                return guildData.id === guild.id;
            });

            if (data) {
                GuildData.create({id: guild.id, prefix: ';'});
            }

        }
    });

    /**
     * Caching Messages
     */
    for(let channel of client.channels.array()) {
        if (channel && channel.type === 'text') {
            channel.messages.fetch();
        }
    }
   
    /**
     * Emits a message to the Creative Logic server when debugging
     */
    if (client.mode === ClientModes.SHIPPING) {
        return;
    }

    const channel = client.channels.get(config.channels.testing);
    if (channel) {
        channel.send('I\'m alive again');
    }
}