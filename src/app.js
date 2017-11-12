const Discord = require('discord.js');
const client = new Discord.Client();
client.mode = 'development';

const config = require('../config.json');
const tokens = require('../tokens.json');

const utils = require('./utils');
const Arguments = require('./types/arguments');
const MusicPlayer = require('./types/musicplayer');

/**
 * @type {MusicPlayer}
 */
var musicPlayer = null;

client.on('ready', async () => {

    let guild = client.guilds.first();

    musicPlayer = new MusicPlayer(guild);

    for(let channel of guild.channels.array()) {
        if (channel && channel.type === 'text') {
            channel.messages.fetch();
        }
    }
   
    if (client.mode === 'normal') {
        return;
    }

    let testChannel = guild.channels.get(config.channels.testing);
    if (testChannel) {
        testChannel.send('I\'m alive again');
    }
});

client.on('message', async (message) => {
    if (utils.shouldCheckMessage(message)) {
        return;
    }
    
    if (message.content.startsWith(config.prefix)) {
        const args = message.content.slice(config.prefix.length).split(' ');
        const name = args.shift().toLowerCase();
        
        let command = utils.getCommands().get(name);
        if (command) {

            const argsObj = new Arguments();

            for (const arg of args) {
                argsObj.push(arg);
            }

            argsObj.musicPlayer = musicPlayer;

            command.execute(message, argsObj).then((result) => {
                if (result) {
                    utils.auditMessage(message.author, `Used \`${config.prefix + command.name} ${argsObj.toString()}\` in ${message.channel.toString()}`);
                }
            });
        }
        return;
    }

    for(let word of config.blacklist) {
        if (message.content.contains(word)) {
            utils.auditMessage(message.author, 
            `Mentioned a blacklisted word! \nThey said, "${message.content}" in ${message.channel.toString()}`, true);

            return;
        }
    }

});

client.on('messageDelete', async (message) => {
    if (client.mode === 'development') {
        return;
    }

    if (message.content === '') {
        return;
    }
    utils.auditMessage(message.author, `Removed "${message.content}" from ${message.channel.toString()}`);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (client.mode === 'development') {
        return;
    }

    if (oldMessage.author.bot || (oldMessage.content === '' && newMessage.content === '') || oldMessage.content === newMessage.content) {
        return;
    }
    utils.auditMessage(newMessage.author, `Changed "${oldMessage.content}" to "${newMessage.content}" in ${newMessage.channel.toString()}`);
});

client.on('guildMemberAdd', async (member) => {
    if (client.mode === 'development') {
        return;
    }

    let WelcomeChannel = member.guild.channels.get(config.channels.welcome);
    let ruleChannel = member.guild.channels.get(config.channels.rules);

    if (WelcomeChannel && ruleChannel) {
        WelcomeChannel.send(`Welcome ${member.toString()} to Creative Logic! Please read the ${ruleChannel.toString()} before moving to the community channels.`);
    }
});

client.on('guildMemberRemove', async (member) => {
    if (client.mode === 'development')
    {
        return;
    }
    utils.auditMessage(member.author, `Left...\nFuck them anyway`);
});

client.on('messageReactionAdd', async (messageReaction, user) => {
    if (!musicPlayer.voiceConnection || messageReaction.emoji.name != 'upvote') {
        return;
    }

    let memberCount = client.channels.get(musicPlayer.voiceConnection.channel.id).members.array().length;

    if (messageReaction.message.id === musicPlayer.skipMessage.id) {

        if (user.id === musicPlayer.skipMessage.requestor.id) {
            messageReaction.remove();
        }

        if (messageReaction.count > (memberCount - 1) / 2) {
            let embed = utils.getEmbed();

            embed.setTitle(`Skipped ${musicPlayer.get().title}`)
            embed.setDescription(musicPlayer.get().url);
            embed.setImage(musicPlayer.get().thumbnail);

            messageReaction.message.channel.send({embed});
            messageReaction.message.delete();
            musicPlayer.skip();
        }
    }
});

client.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (!musicPlayer.voiceConnection) {
        return;
    }

    let memberCount = client.channels.get(musicPlayer.voiceConnection.channel.id).members.array().length;

    if (memberCount == 1) {
        musicPlayer.clear();
    }
});

process.argv.forEach((val, index, array) => {
    if (val.startsWith('-')) {
        let command = val.substr(1);

        switch (command) {
            case 'normal': {
                client.mode = command;
            }
        }
    }
});

client.login(client.mode === 'development' ? tokens.dev : tokens.normal);
