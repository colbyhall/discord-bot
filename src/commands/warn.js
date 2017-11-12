const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;
const Member = Discord.GuildMember;

const utils = require('../utils');

module.exports = {
    name: 'warn',
    category: 'moderation',
    help: '`;warn user message` send the user a dm with the message',
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

        if (args.length < 2) {
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

        member.createDM().then((channel) => {
            let embed = utils.getEmbed();

            embed.setTitle('Warning');
            embed.setColor(0xf44242);
            embed.setDescription(args.toString(1));

            channel.send({embed});
        });

        return true;
    }
}