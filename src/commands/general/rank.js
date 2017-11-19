const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');
const { config } = require('../../util/config');

let ProfileData = require('../../models/profile');

module.exports = {
    name: 'rank',
    category: 'general',
    help: '`;rank` gets current your current rank\n'
        + '`;rank <user>` to get that users rank',
    example: '`;rank @Colby`',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        
        let embed = utils.getEmbed();

        let author = message.author;

        if (args[0]) {
            author = message.guild.members.find((member) => {
                return member.toString() === args[0];
            }).user;
        }

        if (!author) {
            message.reply(`${args[0]} could not be found on this guild`);
        }

        ProfileData.findOne({id: author.id}, (err, profile) => {
            if (profile) {
                const guild = profile.guilds.find((guild) => {
                    return guild.id === message.guild.id;
                });

                embed.setAuthor(`${author.username}#${author.discriminator}`, author.avatarURL());
                embed.setDescription(`Rank: ${utils.getRankFromTotalPoints(guild.rank.level)} (${guild.rank.level}/${utils.getTotalPointsFromRank(utils.getRankFromTotalPoints(guild.rank.level) + 1)})`);
                message.channel.send({embed});
            }
        })

        return false;
    }
}