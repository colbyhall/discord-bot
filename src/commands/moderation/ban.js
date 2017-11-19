const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');
const ProfileData = require('../../models/profile');

module.exports = {
    name: 'ban',
    category: 'moderation',
    help: '`;ban <user> <reason>` to ban the user for that reason\n'
        + '`;ban <user>` to ban that user',
    example: '`;ban @Colby creating an awful discord bot`',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (!utils.canUse(message.member, this)) return;

        if (args.length < 1) {
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

        if (args.toString(1).length > 0) {
            member.createDM().then((channel) => {
                const embed = utils.getEmbed()
                .setAuthor(`${message.guild.name} Staff`, message.guild.iconURL())
                .addField('You have been banned', `Reason: "${args.toString(1)}"`);
                
                channel.send({embed});
                member.ban({
                    reason: args.toString(1)
                });
            });
            return true;
        }
        else {
            member.ban();
            return true;
        }

        ProfileData.findOne({id: member.id}, (err, profile) => {
            if (!profile) return;

            profile.bans.push({reason: args.toString(1), date: Date.now(), guildId: message.guild.id});

            profile.save();
        });

        return false;
    }
}