const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

const Profiles = require('../models/profile');

module.exports = {
    name: 'kick',
    category: 'moderation',
    help: '`;kick user reason` to kick the user for that reason\n`;kick user` to kick that user',
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

        Profiles.findOne({id: member.id}, (err, profile) => {
            if (!profile) return;

            profile.kicks.push({reason: args.toString(1), date: Date.now(), guildId: message.guild.id});

            profile.save();
        });

        return false;
    }
}