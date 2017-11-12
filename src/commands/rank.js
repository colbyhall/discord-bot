const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');
const config = require('../../config.json');

let Profiles = require('../models/profile');

module.exports = {
    name: 'rank',
    category: 'general',
    help: '`;rank` gets current your current rank\n`;rank user` to get that users rank',
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

        Profiles.findOne({id: author.id}, (err, profile) => {
            if (profile) {
                const rank = profile.ranks.find((rank) => {
                    return rank.guildId == message.guild.id;
                });
                embed.setAuthor(`${author.username}#${author.discriminator}`, author.avatarURL());
                embed.setDescription(`Rank: ${Math.trunc(rank.rank / config.rank.exponential)} (${rank.rank}/${(Math.trunc(rank.rank / config.rank.exponential) + 1) * config.rank.exponential})`);
                message.channel.send({embed});
            }
        })

        return false;
    }
}