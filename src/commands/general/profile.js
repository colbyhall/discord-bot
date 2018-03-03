const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');
const ProfileData = require('../../models/profile');

module.exports = {
    name: 'profile',
    category: 'general',
    help: '`;profile` gets your current profile\n'
        + '`;profile <user>` gets that users profile',
    example: '`;profile @Colby`',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        let member = message.member;
        
        if (args.length === 1) {
            member = message.guild.members.find((member) => {
                return member.toString() === args[0];
            });
        } 
        
        if (!member) {
            message.reply('sorry we could not find that member');
            return;
        }
        
        ProfileData.findOne({id: member.id}, (err, profile) => {
            if (!profile) {
                return;
            }

            const guild = profile.guilds.find((guild) => {
                return guild.id === message.guild.id;
            });

            if (!guild) return;

            const embed = utils.getEmbed();

            embed.setAuthor(`${member.displayName}#${member.user.discriminator}`, member.user.avatarURL());

            const rank = guild.rank.level;

            embed.setDescription(
                `Rank: ${utils.getRankFromTotalPoints(rank, 256)} (${rank} / ${utils.getTotalPointsFromRank(utils.getRankFromTotalPoints(rank, 256) + 1, 256)})`
                + `\n\nThis user has ${guild.warnings.length} warnings, ${guild.mutes.length} mutes, ${guild.kicks.length} kicks, and ${guild.bans.length} bans`
            );

            embed.addField('Meta', `Messages Sent: ${guild.meta.messages}\nWords Sent: ${guild.meta.words}\nMentions: ${guild.meta.mentions ? guild.meta.mentions : 0}`);

            message.channel.send({embed});
        });

        return false;
    }
}