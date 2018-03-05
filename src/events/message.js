const { Message } = require('discord.js');
const { CreativeClient, ClientModes, Arguments, CommandType } = require('../types');
const { ProfileData, GuildData } = require('../models')
const utils = require('../util');
const { config } = require('../util/config');

/**
 * This is called everytime a message is sent in a channel that the bot can see
 * @param {CreativeClient} client 
 * @param {Message} message
 */
module.exports = async (client, message) => {

    if (message.channel.type === 'dm' && !message.author.bot) {
        const items = [
            'can you like fucking not',
            'seriously fuck off',
            'who are you talking to me',
            'what is your fucking problem man',
            'jesus fucking christ',
            {
                files: ['https://media.discordapp.net/attachments/329329501945331712/376505116993257475/4564575466.gif']
            }
        ]

        message.channel.send(items[Math.floor(Math.random() * items.length)]);
        return;
    }

    /**
     * Calls a util function if we should check this message
     */
    if (utils.shouldCheckMessage(client, message)) return;
    
    /**
     * Find the guildata of the server this message was sent on
     * @Idea: Possibly move to its own module as its cluttered
     */
    GuildData.findOne({id: message.guild.id}, (err, guild) => {

        /**
         * Don't do anything if the client mode isn't what the guild wants
         */
        if (guild.mode != client.mode && client.mode != ClientModes.DEBUG) return;

        /**
         * Check if the message starts with the command prefix
         */
        if (message.content.startsWith(guild ? guild.prefix: config.prefix)) {
            /**
             * Parse all the command data out
             */
            const args = message.content.slice(config.prefix.length).split(' ');
            const name = args.shift().toLowerCase();

            
            /**
             * Get the command module dynamically from the parsed data
             */
            let command = utils.getCommands().get(name);

            const commandData = guild.commands.find((command) => {
                return command.name === name;
            });

            if (command) {

                if (commandData && !commandData.enabled) return;
                
                if (commandData) {
                    command.roles = commandData.roles;
                }
                /**
                 * Create our dynamic args object and then push the args into it
                 * We're also going to load the musicplayer in there because why not
                 */
                const argsObj = new Arguments();
                for (const arg of args) {
                    argsObj.push(arg);
                }
                argsObj.musicPlayer = client.musicPlayers.get(message.guild.id);
                
                /**
                 * Execute the command and then make check the promise if we should audit the command
                 */

                command.execute(message, argsObj).then((result) => {
                    if (result) {
                        utils.auditMessage(message.member, `Used "${config.prefix + command.name} ${argsObj.toString()}" in ${message.channel.toString()}`);
                    }
                });
            } else if (commandData) {
                if (commandData.enabled && commandData.type && commandData.output) {
                    if (commandData.type != CommandType.CUSTOM && utils.canUse(message.member, {roles: commandData.roles})) {
                        message.channel.send(commandData.output);
                    }
                }
            }
        }

        /**
         * Update Profile data with their used words and such
         * This also handles the rank system
         * @TODO: Move rank system to a seperate module
         */
        ProfileData.findOne({id: message.author.id}, (err, profile) => {

            /**
             * Get the word count
             */
            const words = message.content.split(' ').length;

            /**
             * Create the profile if the user doesn't have one for some reason
             */
            if (!profile) {
                ProfileData.create({
                    id: message.author.id, 
                    rank: {level: words, lastMessageTime: Date.now()},
                    meta: {messages: 1, words: words}
                });

                return;
            }

            /**
             * Get guild data
             * This is used a lot maybe we should make it a function
             */
            const guildData = profile.guilds.find(guild => {
                return guild.id === message.guild.id;
            });

            /**
             * If we dont have the guild data lets make it
             */
            if (!guildData) {
                profile.guilds.push({
                    id: message.guild.id,
                    rank: {level: words, lastMessageTime: Date.now()},
                })
                profile.save();
                return;
            }

            /**
             * Update meta data and start gathering rank info
             */
            const rank = guildData.rank;
            guildData.meta.messages += 1;
            guildData.meta.words += words;

            profile.save();

            /**
             * If the this message was sent a certain ammount of timer after the last counted rank one continue
             */
            if (rank.lastMessageTime && new Date().getTime() - rank.lastMessageTime.getTime() < guild.rankSystem.pointsDelay) return;

            /**
             * Make sure to keep the prev rank
             * Update rank data
             */
            const prevRank = utils.getRankFromTotalPoints(rank.level, guild.rankSystem.exponential);
            rank.level += words;
            rank.lastMessageTime = Date.now();
            
            /**
             * Emit a message saying that they've ranked up
             */
            if (utils.getRankFromTotalPoints(rank.level, guild.rankSystem.exponential) > prevRank) {

                const embed = utils.getEmbed()
                embed.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL());
                embed.setDescription(`Congrats you've ranked up to ${utils.getRankFromTotalPoints(rank.level, guild.rankSystem.exponential)}!`);

                message.channel.send({embed});
            }

            profile.save();
        });

    });

    /**
     * Loop through the mentions of the message
     */
    for (const member of message.mentions.members.array()) {
        /**
         * Find the mentioned user
         */
        ProfileData.findOne({id: member.id}, (err, profile) => {

            if (profile) {

                /**
                 * Get that users guild
                 */
                const guild = profile.guilds.find((guild) => {
                    return guild.id === message.guild.id;
                });

                /**
                 * If we have the guild we add it to the meta object then save
                 */
                if (guild) {
                    guild.meta.mentions += 1;
                    profile.save();
                }
            }

        });
    }
}