const { CreativeClient, ClientModes, Arguments, CommandType } = require('../types');
const { ProfileData, GuildData } = require('../models');
const { Message } = require('discord.js');
const utils = require('../util');
const { config } = require('../util/config');

/**
 * 
 * @param {CreativeClient} client 
 * @param {Message} message 
 */
module.exports = (client, message) => {

    GuildData.findOne({id: message.guild.id}, (err, guild) => {

        if (err) {
            console.error(err);
            return;
        } 
        
        /**
         * Check if the message starts with the command prefix
         */
        if (message.content.startsWith(guild ? guild.prefix: config.prefix)) {
            /**
             * Parse all the command data out
             */
            const args = message.content.slice(config.prefix.length).split(' ');
            const name = args.shift().toLowerCase();
            
            /**
             * Get the command module dynamically from the parsed data
             */
            let command = utils.getCommands().get(name);
            
            const commandData = guild.commands.find((command) => { return command.name === name; });

            if (command) {

                if (commandData && !commandData.enabled) return;
                
                if (commandData) command.roles = commandData.roles;

                if (!guild.setupComplete && command.name != 'command' && command.name != 'help') {
                    message.reply('please use the `;help` command to get you started');
                    return;
                }

                const argsObj = new Arguments(args);

                argsObj.musicPlayer = client.musicPlayers.get(message.guild.id);

                command.execute(message, argsObj).then((result) => {
                    if (result) utils.auditMessage(message.member, `Used "${config.prefix + command.name} ${argsObj.toString()}" in ${message.channel.toString()}`);
                });
            } 
            else if (utils.isValidCustomCommand(commandData)) {
                message.channel.send(commandData.output);
            }
        }
    });
}