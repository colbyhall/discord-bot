const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

const Guilds = require('../models/guild');

module.exports = {
    name: 'command',
    category: 'moderation',
    help: '`;command actualCommand` to get info about that command\n`;command actualCommand add role` to add a role to that command\n`;command actualCommand remove role` to remove that role\n`;command actualCommand enable` to enable that command\n`;command actualCommand disable` to disable that command',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.author, this)) return false;
        
        if (!utils.getCommands().get(args[0])) {
            message.reply(`${args[0]} is not a valid command`);
            return false;   
        }

        let embed = utils.getEmbed();

        Guilds.findOne({id: message.guild.id}, (err, guild) => {

            if (!guild) return;

            let command = guild.commands.find((command) => {
                return command.name == args[0];
            });

            if (!command) {
                let index = guild.commands.push({name: args[0], enabled: true}) - 1;
                command = guild.commands[index];
            }

            let index = guild.commands.indexOf(command);

            if (args.length == 1) {
                if (command) {
                    embed.setTitle(args[0]);
                    embed.setDescription(`enabled: ${command.enabled}`);

                    if (command.roles && command.roles.length > 0) {
                        let rolesText = '';

                        for (const role of command.roles) {
                            rolesText += `${message.guild.roles.get(role).name}\n`
                        }

                        embed.addField('Roles', rolesText)
                    }

                    message.channel.send({embed});
                } 
            }
            else if(args[1] == 'add' && args[2]) {
                let role = message.guild.roles.find((role) => {
                    return role.name == args[2] || role.toString() == args[2];
                });

                if (role) {
                    let foundRole = command.roles.find((roleId) => {
                        return role.id == roleId;
                    });

                    if (!foundRole) {
                        guild.commands[index].roles.push(role.id);
                        guild.save();

                        embed.addField(`Role added to ${command.name}`, args[2])
                        message.channel.send({embed});
                    }
                } else {
                    message.reply('sorry we could not find that role');
                }
            }
            else if(args[1] == 'remove' && args[2]) {
                let role = message.guild.roles.find((role) => {
                    return role.name == args[2] || role.toString() == args[2];
                });

                if (role) {
                    let foundRole = command.roles.indexOf(role.id);

                    if (foundRole > -1) {
                        guild.commands[index].roles.splice([foundRole], 1);
                        guild.save();
                        embed.addField(`Role removed from ${command.name}`, args[2])
                        message.channel.send({embed});
                    }
                } else {
                    message.reply('sorry we could not find that role');
                }
            }
            else if(args[1] == 'enable') {
                guild.commands[index].enabled = true;
                guild.save();
                embed.addField(`${command.name}`, 'enabled');
                message.channel.send({embed});
            }
            else if(args[1] == 'disable') {
                guild.commands[index].enabled = false;
                guild.save();
                embed.addField(`${command.name}`, 'disabled');
                message.channel.send({embed});
            }
            else if(args[2] == 'toggle') {
                guild.commands[index].enabled = !guild.commands[index].enabled;
                guild.save();
                embed.addField(`${command.name}`, guild.commands[index].enabled ? 'enabled' : 'disabled');
                message.channel.send({embed});
            }
            else {
                utils.getCommands().get('help').execute(message, new Array(this.name));
            }
        });

        return args.length > 0;
    }
}