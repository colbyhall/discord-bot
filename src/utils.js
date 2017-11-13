const fs = require('fs');
const Discord = require('discord.js');
const request = require('superagent');
const client = new Discord.Client();
client.mode = 'normal';

const config = require('../config.json');
const tokens = require('../tokens.json');

const Message = Discord.Message;
const MessageEmbed = Discord.MessageEmbed;
const GuildMember = Discord.GuildMember;
const Collection = Discord.Collection;
const Command = require('./types/command');
const Arguments = require('./types/arguments');
const User = Discord.User;

const Guilds = require('./models/guild');

/**
 * @param {String} search_for
 * @returns {Boolean}
 */
String.prototype.contains = function(search_for) {
    var v = (this || '').toLowerCase();
    var v2 = search_for;
    if (v2) {
        v2 = v2.toLowerCase();
    }
    return v.indexOf(v2) > -1;
}

/**
 * Used for Capitilizing first letter of sentece
 * @returns {String}
 */
String.prototype.firstLetterToUpperCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = {
    /**
    * Audits an embeded message to our audit channel
    * @param {GuildMember} member
    * @param {String} reason title of embed
    * @param {String} message message of embed
    * @param {Boolean} warning message of embed
    */
    auditMessage(member, message, warning = false) {

        if (!member.guild) return;

        Guilds.findOne({id: member.guild.id}, (err, guild) => {
            if (!guild || !guild.channels || !guild.channels.audit) return;
            let auditChannel = client.channels.get(guild.channels.audit);
    
            if (auditChannel) {
                let embed = this.getEmbed();
                embed.setColor(warning ? 0xf44242 : 0xf4eb41);
                embed.setDescription(message);
                embed.setAuthor(`${member.user.username}#${member.user.discriminator}`, member.user.avatarURL());
                auditChannel.send({embed});
            }
        })
    },
    /**
     * Searches youtube and returns top 5 results
     * @param {String} keywords Search Keywords
     * @param {GuildMember} author Member who is searching
     * @param {Function} callback Called after data is found
     */
    youtubeSearch(keywords, author, callback) {
        let request_url = 'https://www.googleapis.com/youtube/v3/search' + `?part=snippet&q=${escape(keywords)}&key=${tokens.api.youtube}`;

        request.get(request_url, (err, res) => {
            if (res.statusCode == 200) {
                var body = res.body;
                if (body.items.length == 0) {
                    callback({ error: "Couldn't find any videos matching those tags" });
                    return;
                }
                
                let videos = []

                for (let item of body.items) {
                    if (item.id.kind == 'youtube#video') {
                        var video_id = item.id.videoId;
                        videos.push({
                            url: `https://www.youtube.com/watch?v=${video_id}`,
                            title: item.snippet.title,
                            thumbnail: item.snippet.thumbnails.medium.url,
                            requestor: author,
                            video_id: item.id.videoId
                        });
                    }
                }
                callback({
                    results: videos,
                    error: ""
                });
            }
            else {
                callback({ error: "Couldn't contact Youtube" });
            }
        });
    },
    spotifySearch(keywords, callback) {
        request.get('https://api.spotify.com/v1/authorize', (err, res) => {
            console.log(res.body);
        });
    },
    /**
     * Returns true if member has role listed in command
     * @param {User} user
     * @param {Command} command
     * @returns {Boolean}
     */
    canUse(user, command) {

        if (!command.roles) {
            return true;
        }

        for(let guild of client.guilds.array()) {
            for(const guild_id of command.roles) {
                if (guild.roles.has(guild_id)) {
                    const guildMember = guild.members.get(user.id);
                    for (const id of command.roles) {
                        if (guildMember.roles.has(id)) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;

    },
    /**
     * Returns a general embeded template that we like to use
     * @returns {MessageEmbed}
     */
    getEmbed() {
        let embed = new Discord.MessageEmbed();
        embed.setColor(this.botColor);
        embed.setTimestamp();
        embed.setFooter("love, your friendly bot");
        return embed;
    },
    /**
     * General color of the bot used for embeded messages
     */
    botColor: 0x8754ff,
    /**
     * Used for if we should return when handling messages
     * @param {Message} message Message from handler
     * @returns {Boolean}
     */
    shouldCheckMessage(message) {
        return (client.mode === 'development' && message.channel.id != config.channels.testing) 
            || (client.mode === 'normal') && message.channel.id == config.channels.testing 
            || message.author.bot
    },
    /**
     * Gets all commands
     * @returns {Collection<String, Command>}
     */
    getCommands() {
        let commands = new Discord.Collection()
        
        const commandFiles = fs.readdirSync('./commands');
        
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            commands.set(command.name, command);
        }

        return commands;
    },
    /**
     * 
     * @param {Number} totalPoints 
     * @returns {Number}
     */
    getRankFromTotalPoints(totalPoints) {
        let points = 0;
        let rank = 0;
        while(points < totalPoints) {
            rank++;
            points += config.rank.exponential * rank;
        }

        return rank;
    },
    /**
     * 
     * @param {Number} rank 
     * @returns {Number}
     */
    getTotalPointsFromRank(rank) {
        let points = 0;
        for (let i = 0; i < rank; i++) {
            points += config.rank.exponential * i;
        }

        return points;
    }
};

process.argv.forEach((val, index, array) => {
    if (val.startsWith('-')) {
        let command = val.substr(1);

        switch (command) {
            case 'development': {
                client.mode = command;
            }
        }
    }
});

client.login(client.mode === 'development' ? tokens.dev : tokens.normal);