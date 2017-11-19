const { Message } = require('discord.js');
const { Arguments } = require('../../types'); 
const utils = require('../../util');
const { GuildData } = require('../../models');
const { config } = require('../../util/config');

module.exports = {
    name: 'broadcast',
    category: 'moderation',
    help: '`;broadcast <message>` to broadcast a message to all creative logic bot servers',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (message.guild.id !== config.homeServer) return;

        if (!utils.canUse(message.member, this)) return;

        if (!args[0]) {
            utils.executeCommandHelp(message, this);
            return;
        }

        GuildData.find((err, data) => {

            for (const guild of data) {
                if(guild.channels.audit) {
                    const channel = message.client.channels.get(guild.channels.audit);
                    if (channel) {
                        const embed = utils.getEmbed()
                        .setTitle('Broadcast')
                        .setColor(0xf44242)
                        .setDescription(args.toString());
                        channel.send({embed});
                    }
                }
            }

        });

        return false;
    }
}