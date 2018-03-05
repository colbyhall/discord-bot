const { Message } = require('discord.js');
const Arguments = require('../../types/arguments'); 
const utils = require('../../util');
const config = require('../../util/config');

module.exports = {
    name: 'translate',
    category: 'general',
    help: '`;translate <language> <message>` to translate that message in the language\n'
        + '`;translate list` to get a list of supported langauges',
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        const googleTranslate = require('google-translate')(config.tokens.youtube);
        const langs = [
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
            {
                name: "swedish",
                abrev: "sv"
            },
            {
                name: "japanese",
                abrev: "ja"
            },
            {
                name: "chinese",
                abrev: "zh"
            },
            {
                name: "dutch",
                abrev: "nl"
            },
        ];

        if (args.length < 2) {

            if (args[0] && args[0] === 'list') {
                const embed = utils.getEmbed();
                embed.setTitle(`Supported Languages`);
                let desc = '';

                for (const lang of langs) desc += lang.name.firstLetterToUpperCase() + '\n';
                desc += '\nPlease use ;report to request more languages';

                embed.setDescription(desc);
                message.channel.send(embed);

                return false;
            }

            utils.executeCommandHelp(message, this);
            return false;
        }

        const lang = langs.find((lang) => {
            return args[0].toLowerCase() === lang.name || args[0].toLowerCase() === lang.abrev;
        });

        googleTranslate.translate(args.toString(1), lang.abrev, (err, translation) => {
            const embed = utils.getEmbed();
            embed.setTitle(`${lang.name.firstLetterToUpperCase()} Translation`);
            embed.setDescription(`"${args.toString(1)}" -> "${translation.translatedText}"`);
            message.channel.send(embed);
        });

        return false;
    }
}