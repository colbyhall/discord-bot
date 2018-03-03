const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');
const GuildData = require('../../models/guild');

module.exports = {
    name: 'message',
    category: 'moderation',
    help: '`;message <channel> <message>` to set current channel to that purpose',
    example: '`;message #audit you a gay`',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.member, this)) return false;

        if (args.length < 2) utils.executeCommandHelp(message, this);

        const channel = message.guild.channels.find((channel) => {
            return args[0] === channel.toString();
        });

        if (!channel) message.channel.send('That channel does not exist');

        channel.send(args.toString(1));

        message.channel.send('Message Sent.');
        
    }
}