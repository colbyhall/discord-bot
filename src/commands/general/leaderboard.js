const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');
const { ProfileData } = require('../../models');

module.exports = {
    name: 'leaderboard',
    category: 'general',
    help: '`;leaderboard` to get the total ranks',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        ProfileData.find((err, res) => {

            if (!res) return;

            let membersOfGuild = [];

            for (const profile of res) {
                for (const guild of profile.guilds) {
                    if (guild.id === message.guild.id) {
                        membersOfGuild.push(profile);
                    }
                }
            }

            if (membersOfGuild.length > 0) {
                membersOfGuild.sort((a, b) => {
                    const aRank = a.guilds.find((guild) => {
                        return guild.id === message.guild.id;
                    }).rank;

                    const bRank = b.guilds.find((guild) => {
                        return guild.id === message.guild.id;
                    }).rank;

                    return bRank.level - aRank.level;
                });

                const embed = utils.getEmbed();

                embed.setTitle(`${message.guild.name} Leaderboard`);
                for (let i = 0; i < membersOfGuild.length; i++) {

                    const guildMember = message.guild.members.get(membersOfGuild[i].id);
                    if (!guildMember) continue;

                    const name = guildMember.displayName;

                    const rank = membersOfGuild[i].guilds.find((guild) => {
                        return guild.id === message.guild.id;
                    }).rank;

                    embed.addField(`${i + 1}: ${name}`, `Rank: ${utils.getRankFromTotalPoints(rank.level, 256)} (${rank.level}/${utils.getTotalPointsFromRank(utils.getRankFromTotalPoints(rank.level, 256) + 1, 256)})`);

                    if (i > 18) break;
                }

                message.channel.send(embed);
            }

        });

        return false;
    }
}