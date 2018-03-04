const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');
const config = require('../../util/config');

module.exports = {
    name: 'translate',
    category: 'general',
    help: '`;translate <lang> <message>`',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        const googleTranslate = require('google-translate')(config.tokens.youtube);
        const lang = [
            {
                name: "english",
                abrev: "en"
            },
            {
                name: "spanish",
                abrev: "es"
            },
            {
                name: "norwegian",
                abrev: "no"
            },
            {
                name: "german",
                abrev: "de"
            },
            {
                name: "french",
                abrev: "fr"
            },
        ];

        if (args.length < 2) {

            if (args[0] && args[0] === 'list') {
                const embed = utils.getEmbed();
                embed.setTitle(`Supported Languages`);
                let desc = '';
                for (const language of lang) {
                    desc += language.name + '\n';
                }
                desc += '\nplease use ;report to request more languages';
                embed.setDescription(desc);
                message.channel.send(embed);

                return false;
            }

            utils.executeCommandHelp(message, this);
            return false;
        }

        const abrev = lang.find((lang) => {
            return args[0].toLowerCase() === lang.name || args[0].toLowerCase() === lang.abrev;
        }).abrev;

        googleTranslate.translate(args.toString(1), abrev, (err, translation) => {
            const embed = utils.getEmbed();
            embed.setTitle(`${args[0]} translation`);
            embed.setDescription(`"${args.toString(1)}": "${translation.translatedText}"`);
            message.channel.send(embed);
        });

        return false;
    }
}