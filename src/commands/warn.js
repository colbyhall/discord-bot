const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;
const Member = Discord.GuildMember;

const utils = require('../utils');

let Profiles = require('../models/profile');

const moment = require('moment');


module.exports = {
    name: 'warn',
    category: 'moderation',
    help: '`;warn user message` send the user a dm with the message\n`;warn user` to get users warnings on server\n`;warn user remove index` removes that warning of that index\n`;warn user clear` clears that users warnings',
    role: [
        "369607830413639680",
        "369662679473848320",
        "369615751906066433"
    ],
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message, this)) {
            return false;
        }

        if (args.length < 1) {
            utils.getCommands().get('help').execute(message, new Array(this.name));
            return false;
        }

        const guild = message.channel.guild;
        /**
         * @type {Member}
         */
        let member = guild.members.find((member) => {
            return member.toString() === args[0];
        });

        if (!member) {
            message.reply(`${args[0]} can not be found`);
            return false;
        }

        Profiles.findOne({id: member.user.id}, (err, profile) => {
            if (profile) {
                let embed = utils.getEmbed();
                if (!args[1]) {
                    for (let i = 0; i < profile.warnings.length; i++) {
                        if (profile.warnings[i].guildId == message.guild.id) {
                            embed.addField(`${i + 1}: "${profile.warnings[i].reason}"`, `${moment(profile.warnings[i].date).toString()}`);
                        }
                    }

                    if (embed.fields.length == 0) {
                        embed.setDescription(`${member.toString()} is a good noodle`);
                    }

                    message.channel.send({embed});
                    return;
                }
                else if (args[1] === 'clear') {
                    let warnings = [];
                    for(let i = 0; i < profile.warnings.length; i++) {
                        if (profile.warnings[i].guildId != message.guild.id) {
                            warnings.push(profile.warnings[1]);
                        }
                    }
                    embed.setDescription(`Removed warnings from ${member.toString()}`);
                    message.channel.send({embed});

                    profile.warnings = warnings;
                    profile.save();
                    return;
                }
                else if(args[1] === 'remove') {
                    const parsed = parseInt(args[2], 10);

                    if (parsed != NaN && parsed < 1 && parsed > profile.warnings.length) {
                        embed.setDescription(`${args[2]} is not a valid index`);
                        message.channel.send({embed});
                        return;
                    }

                    embed.setDescription(`Removing warning "${profile.warnings[parsed - 1].reason}" from ${moment(profile.warnings[parsed - 1].date).toString()}`);
                    message.channel.send({embed});

                    profile.warnings.splice(parsed - 1, 1);
                    profile.save();

                    return;
                }

                profile.warnings.push({reason: args.toString(1), date: Date.now(), guildId: message.guild.id})
                profile.save();

                member.createDM().then((channel) => {
                    embed.setColor(0xf44242);
                    embed.setAuthor(message.guild.name, message.guild.iconURL());
                    embed.setDescription(`You have recieved a warning.\nReason: "${args.toString(1)}"\n`);
                    embed.setTitle(`Warning: ${profile.warnings.length}`);

                    channel.send({embed});
                })
            }
        })

        return true;
    }
}