const { Message } = require('discord.js');
const { CreativeClient, ClientModes, Arguments } = require('../types');
const { ProfileData, GuildData } = require('../models')
const utils = require('../util');
const { config } = require('../util/config');

/**
 * @param {CreativeClient} client 
 * @param {Message} message
 */
module.exports = async (client, message) => {

    if (utils.shouldCheckMessage(client, message)) return;
    

    GuildData.findOne({id: message.guild.id}, (err, guild) => {

        if (guild.mode != client.mode && client.mode != ClientModes.DEBUG) return;

        if (message.content.startsWith(guild ? guild.prefix: config.prefix)) {
            const args = message.content.slice(config.prefix.length).split(' ');
            const name = args.shift().toLowerCase();
            
            let command = utils.getCommands().get(name);
            if (command) {
                
                const argsObj = new Arguments();
                
                for (const arg of args) {
                    argsObj.push(arg);
                }
                
                argsObj.musicPlayer = client.musicPlayers.get(message.guild.id);

                command.execute(message, argsObj).then((result) => {
                    if (result) {
                        utils.auditMessage(message.member, `Used "${config.prefix + command.name} ${argsObj.toString()}" in ${message.channel.toString()}`);
                    }
                });
            }
        }

        ProfileData.findOne({id: message.author.id}, (err, profile) => {

            const words = message.content.split(' ').length;

            if (!profile) {
                ProfileData.create({
                    id: message.author.id, 
                    rank: {level: words, lastMessageTime: Date.now()},
                    meta: {messages: 1, words: words}
                });

                return;
            }

            const guildData = profile.guilds.find(guild => {
                return guild.id === message.guild.id;
            });

            if (!guild) {
                profile.guilds.push({
                    id: message.guild.id,
                    rank: {level: words, lastMessageTime: Date.now()},
                })
                profile.save();
                return;
            }

            const rank = guildData.rank;
            guildData.meta.messages += 1;
            guildData.meta.words += words;

            profile.save();

            if (rank.lastMessageTime && new Date().getTime() - rank.lastMessageTime.getTime() < guild.rankSystem.pointsDelay) return;

            const prevRank = utils.getRankFromTotalPoints(rank.level, guild.rankSystem.exponential);

            rank.level += words;

            rank.lastMessageTime = Date.now();

            if (utils.getRankFromTotalPoints(rank.level, guild.rankSystem.exponential) > prevRank) {
                const embed = utils.getEmbed()
                embed.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL());
                embed.setDescription(`Congrats you've ranked up to ${utils.getRankFromTotalPoints(rank.level, guild.rankSystem.exponential)}!`);

                message.channel.send({embed});
            }

            profile.save();
        });

    });

    for (const member of message.mentions.members.array()) {
        ProfileData.findOne({id: member.id}, (err, profile) => {
            if (profile) {
                const guild = profile.guilds.find((guild) => {
                    return guild.id === message.guild.id;
                });

                if (guild) {
                    guild.meta.mentions += 1;
                    profile.save();
                }
            }
        });
    }
}