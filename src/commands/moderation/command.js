const { Message } = require('discord.js');
const { Arguments, CommandType } = require('../../types'); 
const utils = require('../../util');
const GuildData = require('../../models/guild');

module.exports = {
    name: 'command',
    category: 'moderation',
    help: '`;command <command>` to get info about that command\n'
        + '`;command <command> add <role>` to add a role to that command\n'
        + '`;command <command> remove <role>` to remove that role\n'
        + '`;command <command> enable` to enable that command\n'
        + '`;command <command> disable` to disable that command\n'
        + '`;command <command> create <content>` to create a custom command\n'
        + '`;command <command> edit <content>` to edit the content of a custom command\n'
        + '`;command <command> delete` to delete a command\n'
        + '`;command all delete` to delete all command data',
    example: ';command purge add admins',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.member, this)) return false;
        
        let doCategory = false;

        const category = utils.getCommands().filter((elem) => {
            return elem.category === args[0];
        }).array();

        if (category && category.length > 0) {
            doCategory = true;
        }

        if (args.length === 0) {
            utils.executeCommandHelp(message, this);
            return;
        }

        const embed = utils.getEmbed();

        GuildData.findOne({id: message.guild.id}, (err, guild) => {

            if (!guild) return;

            if (!guild.setupComplete && !message.member.hasPermission("ADMINISTRATOR")) {
                return;
            }

            if (!guild.setupComplete && args[1]) {
                guild.setupComplete = true;
                guild.save();
            }

            if (args[1] === 'delete') {
                if (args[0] === 'all') {
                    guild.commands = [];
                    embed.addField('All Commands', 'Deleted');
                    guild.save();
                    return;
                } else if (args[0] === 'default') {
                    const commandsToRemove = guild.commands.filter((elem) => {
                        return elem.type === CommandType.CUSTOM;
                    });

                    for (let i = 0; i < commandsToRemove.length; i++) {
                        commandsToRemove[i] = null;
                    }

                    guild.save();
                    return;
                }

            }

            function editCommand(command, name) {
                if (!command) {
                    if (!utils.getCommands().get(name) && args[1] !== 'create') {
                        message.reply(`${name} is not a valid command`);  
                        return;
                    }
                    let index = guild.commands.push({name: name}) - 1;
                    command = guild.commands[index];
                }

                if (name === 'command' && args[1] == 'disable' || args[2] === 'toggle') return;
    
                let index = guild.commands.indexOf(command);
    
                if (args.length === 1) {
                    if (command) {
                        embed.setTitle(name);
                        embed.setDescription(`enabled: ${command.enabled}`);
    
                        if (command.roles && command.roles.length > 0) {
                            let rolesText = '';
    
                            for (const role of command.roles) {
                                rolesText += `${message.guild.roles.get(role).name}\n`
                            }
    
                            embed.addField('Roles', rolesText)
                        }
    
                        if (!doCategory) message.channel.send({embed});
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
                            if (!doCategory) guild.save();
    
                            embed.addField(`Role added to ${command.name}`, args[2])
                            if (!doCategory) message.channel.send({embed});
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
                            if (!doCategory) guild.save();
                            embed.addField(`Role removed from ${command.name}`, args[2])
                            if (!doCategory) message.channel.send({embed});
                        }
                    } else {
                        message.reply('sorry we could not find that role');
                    }
                }
                else if(args[1] == 'enable') {
                    guild.commands[index].enabled = true;
                    if (!doCategory) guild.save();
                    embed.addField(`${command.name}`, 'enabled');
                    if (!doCategory) message.channel.send({embed});
                }
                else if(args[1] == 'disable') {
                    guild.commands[index].enabled = false;
                    if (!doCategory) guild.save();
                    embed.addField(`${command.name}`, 'disabled');
                    if (!doCategory) message.channel.send({embed});
                }
                else if(args[2] == 'toggle') {
                    guild.commands[index].enabled = !guild.commands[index].enabled;
                    if (!doCategory) guild.save();
                    embed.addField(`${command.name}`, guild.commands[index].enabled ? 'enabled' : 'disabled');
                    if (!doCategory) message.channel.send({embed});
                }
                else if((args[1] === 'create' || args[1] === 'edit') && args[2]) {
                    const rest = args.toString(2);

                    if (rest.endsWith('.png') || rest.endsWith('.gif') || rest.endsWith('.jpg') || rest.endsWith('.jpeg')) {
                        // file
                        command.type = CommandType.FILE;

                        command.output = { files: [rest] };
                    } else {
                        // text
                        command.type = CommandType.TEXT;

                        command.output = rest;
                    }

                    embed.addField(`${command.name}`, args[1] === 'create' ? 'Created' : 'Edited');
                    if (!doCategory) message.channel.send({embed});

                    if (!doCategory) guild.save();
                }
                else if(args[1] === 'delete' && command.type && command.type != CommandType.CUSTOM) {
                    embed.addField(`${command.name}`, 'Deleted');
                    if (!doCategory) message.channel.send({embed});
                    guild.commands.splice(index);
                    if (!doCategory) guild.save();
                }
                else {
                    utils.executeCommandHelp(message, this);
                }
            }

            if (!doCategory) {
                let command = guild.commands.find((command) => {
                    return command.name == args[0];
                });

                if (args[1] === 'create' && command) {
                    message.reply('this command has already been created');
                    return false;
                }

                editCommand(command, args[0]);

            } else {
                const category = utils.getCommands().filter((elem) => {
                    return elem.category === args[0];
                }).array();

                for (const commandData of category) {
                    let command = guild.commands.find((command) => {
                        return command.name == commandData.name;
                    });

                    editCommand(command, commandData.name);
                }

                guild.save();
            }
            
        });

        return args.length > 0;
    }
}