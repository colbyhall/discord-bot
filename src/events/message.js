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
    
    const words = message.content.split(' ').length;

    const points = words;

    ProfileData.findOne({id: message.author.id}, (err, profile) => {
        if (profile) {

            const guild = profile.guilds.find(guild => {
                return guild.id === message.guild.id;
            });

            if (!guild) {
                profile.guilds.push({
                    id: message.guild.id,
                    rank: {level: points, notify: true, lastMessageTime: Date.now()},
                    meta: {messages: 1, words: words, joinedDate: Date.now(), mentions: 0} 
                })
                profile.save();
                return;
            }
            
            const rank = guild.rank;
            const meta = guild.meta;
            meta.messages += 1;
            meta.words += words;

            profile.save();

            if (new Date().getTime() - rank.lastMessageTime.getTime() < 1000 * 60) return;

            const prevRank = utils.getRankFromTotalPoints(rank.level);

            rank.level += points;
            rank.lastMessageTime = Date.now();

            if (utils.getRankFromTotalPoints(rank.level) > prevRank) {
                const embed = utils.getEmbed()
                embed.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL());
                embed.setDescription(`Congrats you've ranked up to ${utils.getRankFromTotalPoints(rank.level)}!`);

                message.channel.send({embed});
            }

            profile.save();
            return;
        }

        ProfileData.create({id: message.author.id, guilds: [{
            id: message.guild.id,
            rank: {level: points, notify: true, lastMessageTime: Date.now()},
            meta: {messages: 1, words: words, joinedDate: Date.now(), mentions: 0} 
        }]});
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

                if (client.mode !== ClientModes.DEBUG && false) {
                    if (!guild.setupComplete && (name !== 'help' || name !== 'setup')) {
                        if (message.member.hasPermission('ADMINISTRATOR')) {
                            message.reply('please run the setup command');
                        }
                        else {
                            message.reply('please get your admins to run the setup command');
                        }
                        return;
                    } 
    
                    if (name === 'setup' && !guild.setupComplete && !message.member.hasPermission('ADMINISTRATOR')) {
                        message.reply('only administrators can run setup');
                        return;
                    }
                }

                command.execute(message, argsObj).then((result) => {
                    if (result) {
                        utils.auditMessage(message.member, `Used "${config.prefix + command.name} ${argsObj.toString()}" in ${message.channel.toString()}`);
                    }
                });
            }
            return;
        }

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