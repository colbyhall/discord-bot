const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

module.exports = {
    name: 'kick',
    category: 'moderation',
    help: '`;kick user reason` to kick the user for that reason\n`;kick user` to kick that user',
    roles: [
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

        if (!utils.canUse(message.author, this)) return;
        
        let member = message.guild.members.find((member) => {
            return member.toString() == args[0];
        });

        if (!member) {
            message.reply('sorry we could\'nt find that member');
            return;
        }

        if (args[1]) {
            member.createDM().then((channel) => {
                let embed = utils.getEmbed();
                embed.setAuthor(`${message.guild.name} Staff`, message.guild.iconURL());
                embed.addField('You have been kicked', `Reason: "${args.toString(1)}"`);
                
                channel.send({embed});
                member.kick();
            });
            return true;
        }
        else {
            member.kick();
            return true;
        }

        return false;
    }
}