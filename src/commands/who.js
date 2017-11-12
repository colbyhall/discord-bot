const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

module.exports = {
    name: 'who',
    category: 'general',
    help: '`;who` returns number of users online',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {
        const guild = message.guild;

        const onlineUsers = guild.members.filter((member) => {
            return member.presence.status === 'online' || member.presence.status === 'idle';
        }).array().length;
        message.channel.send(`There are ${onlineUsers} users online`)

        return false;
    }
}