const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util/utils');
const ProfileData = require('../../models/profile');

module.exports = {
    name: 'profile',
    category: 'moderation',
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
            const embed = utils.getEmbed();

            embed.setAuthor(`${member.displayName}#${member.user.discriminator}`, member.user.avatarURL());

            const rank = profile.ranks.find((rank) => {
                return rank.guildId == message.guild.id;
            }).rank;

            const warnings = profile.warnings.filter((warning) => {
                return warning.guildId === message.guild.id;
            }).length;

            const mutes = profile.mutes.filter((mute) => {
                return mute.guildId === message.guild.id;
            }).length;

            const kicks = profile.kicks.filter((kick) => {
                return kick.guildId === message.guild.id;
            }).length;

            const bans = profile.bans.filter((ban) => {
                return ban.guildId === message.guild.id;
            }).length;

            embed.setDescription(`**Rank:** ${utils.getRankFromTotalPoints(rank)} (${rank} / ${utils.getTotalPointsFromRank(utils.getRankFromTotalPoints(rank) + 1)})\n\nThis user has ${warnings} warnings, ${mutes} mutes, ${kicks} kicks, and ${bans} bans`);

            message.channel.send({embed});
        });

        return false;
    }
}