const { CreativeClient, MusicPlayer, ClientModes } = require('../types');
const { GuildData, ProfileData } = require('../models')
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
    for (const guild of client.guilds.array()) {
        GuildData.findOne({id: guild.id}, (err, guildData) => {
            if (!guildData) {
                GuildData.create({id: guild.id, prefix: ';', setupComplete: false});
                
                for (const member of guild.members.array()) {
                    ProfileData.findOne({id: member.id}, (err, profile) => {
            
                        if (!profile) {
                            ProfileData.create({
                                id: member.id,
                                guilds: [{
                                    id: guild.id,
                                    meta: {joinedDate: Date.now(), messages: 0, mentions: 0, words: 0}
                                }]
                            });
                        }
                        else {
                            profile.guilds.push({
                                id: guild.id,
                                meta: {joinedDate: Date.now(), messages: 0, mentions: 0, words: 0}
                            });
            
                            profile.save();
                        }
            
                    });
                }
            }
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