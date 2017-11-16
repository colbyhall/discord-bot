const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util/utils');
const ProfileData = require('../../models/profile');

module.exports = {
    name: 'kick',
    category: 'moderation',
    help: '`;kick <user> <reason>` to kick the user for that reason\n'
        + '`;kick <user>` to kick that user',
    example: '`;kick @Colby the bot is not good enough`',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.member, this)) return;
        
        if (!args[0]) {
            utils.executeCommandHelp(message, this);
            return;
        }

        const member = message.guild.members.find((member) => {
            return member.toString() == args[0];
        });

        if (!member) {
            message.reply('sorry we could\'nt find that member');
            return;
        }

        if (args[1]) {
            member.createDM().then((channel) => {
                const embed = utils.getEmbed()
                .setAuthor(`${message.guild.name} Staff`, message.guild.iconURL())
                .addField('You have been kicked', `Reason: "${args.toString(1)}"`);
                
                channel.send({embed});
                member.kick();
            });
            return true;
        }
        else {
            member.kick();
            return true;
        }

        ProfileData.findOne({id: member.id}, (err, profile) => {
            if (!profile) return;

            profile.kicks.push({reason: args.toString(1), date: Date.now(), guildId: message.guild.id});

            profile.save();
        });

        return false;
    }
}