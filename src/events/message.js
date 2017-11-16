const { Message } = require('discord.js');
const { CreativeClient } = require('../types');
const { ProfileData, GuildData } = require('../models')
const utils = require('../util/utils');

/**
 * @param {CreativeClient} client 
 * @param {Message} message
 */
module.exports = async (client, message) => {

    if (utils.shouldCheckMessage(client, message)) return;
    
    let points = message.content.split(' ').length;

    if (points > 5) {
        points = 5;
    }

    ProfileData.findOne({id: message.author.id}, (err, profile) => {

        if (profile) {
            if (!profile.ranks) {
                profile.ranks = [{guildId: message.guild.id, rank: points}]
                profile.save()
                return;
            }
            
            const rank = profile.ranks.find((rank) => {
                return rank.guildId == message.guild.id;
            });

            const prevRank = utils.getRankFromTotalPoints(rank.rank);

            rank.rank += points;

            if (utils.getRankFromTotalPoints(rank.rank) > prevRank) {
                const embed = utils.getEmbed()
                embed.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL());
                embed.setDescription(`Congrats you've ranked up to ${utils.getRankFromTotalPoints(rank.rank)}!`);

                message.channel.send({embed});
            }

            profile.save();
            return;
        }

        ProfileData.create({id: message.author.id, guilds: [message.guild.id], ranks: [{guildId: message.guild.id, rank: points}]});

    });

    GuildData.findOne({id: message.guild.id}, (err, guild) => {

        if (message.content.startsWith(guild ? guild.prefix: config.prefix)) {
            const args = message.content.slice(config.prefix.length).split(' ');
            const name = args.shift().toLowerCase();
            
            const commandData = guild.commands.find((command) => {
                return command.name == name;
            });

            let command = utils.getCommands().get(name);
            if (command) {
    
                if (commandData) {
                    command.roles = commandData.roles;

                    if (!commandData.enabled) {
                        return;
                    }
                }

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
            return;
        }

    });

    for(let word of config.blacklist) {
        if (message.content.contains(word)) {
            utils.auditMessage(
                message.member, 
                'Mentioned a blacklisted word! \n' +
                `They said, "${message.content}" in ${message.channel.toString()}`,
                true
            );
            return;
        }
    }
}