const { CreativeClient, ClientModes, Arguments, CommandType } = require('../types');
const { ProfileData, GuildData } = require('../models');
const { Message } = require('discord.js');
const utils = require('../util');
const { config } = require('../util/config');

/**
 * 
 * @param {CreativeClient} client 
 * @param {Message} message 
 */
module.exports = (client, message) => {

    /**
     * Find the guildata of the server this message was sent on
     * @Idea: Possibly move to its own module as its cluttered
     */
    GuildData.findOne({id: message.guild.id}, (err, guild) => {

        if (err) {
            console.error(err);
            return;
        } 
        /**
         * Update Profile data with their used words and such
         * This also handles the rank system
         * @TODO: Move rank system to a seperate module
         */
        ProfileData.findOne({id: message.author.id}, (err, profile) => {

            /**
             * Get the word count
             */
            const words = message.content.split(' ').length;

            /**
             * Create the profile if the user doesn't have one for some reason
             */
            if (!profile) {
                ProfileData.create({
                    id: message.author.id, 
                    rank: {level: words, lastMessageTime: Date.now()},
                    meta: {messages: 1, words: words}
                });

                return;
            }

            /**
             * Get guild data
             * This is used a lot maybe we should make it a function
             */
            const guildData = profile.guilds.find(guild => {
                return guild.id === message.guild.id;
            });

            /**
             * If we dont have the guild data lets make it
             */
            if (!guildData) {
                profile.guilds.push({
                    id: message.guild.id,
                    rank: {level: words, lastMessageTime: Date.now()},
                })
                profile.save();
                return;
            }

            /**
             * Update meta data and start gathering rank info
             */
            const rank = guildData.rank;
            guildData.meta.messages += 1;
            guildData.meta.words += words;

            profile.save();

            /**
             * If the this message was sent a certain ammount of timer after the last counted rank one continue
             */
            if (rank.lastMessageTime && new Date().getTime() - rank.lastMessageTime.getTime() < guild.rankSystem.pointsDelay) return;

            /**
             * Make sure to keep the prev rank
             * Update rank data
             */
            const prevRank = utils.getRankFromTotalPoints(rank.level, guild.rankSystem.exponential);
            rank.level += words;
            rank.lastMessageTime = Date.now();
            
            /**
             * Emit a message saying that they've ranked up
             */
            if (utils.getRankFromTotalPoints(rank.level, guild.rankSystem.exponential) > prevRank) {

                const embed = utils.getEmbed()
                embed.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL());
                embed.setDescription(`Congrats you've ranked up to ${utils.getRankFromTotalPoints(rank.level, guild.rankSystem.exponential)}!`);

                message.channel.send({embed});
            }

            profile.save();
        });

    });

    /**
     * Loop through the mentions of the message
     */
    for (const member of message.mentions.members.array()) {
        /**
         * Find the mentioned user
         */
        ProfileData.findOne({id: member.id}, (err, profile) => {

            if (err) {
                console.error(err);
                return;
            }

            const guild = profile.guilds.find((guild) => {
                return guild.id === message.guild.id;
            });

            if (!guild) return;

            guild.meta.mentions += 1;
            profile.save();

        });
    }
}