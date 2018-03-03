const { Guild, GuildMember, StreamDispatcher, VoiceConnection, Message, TextChannel, MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');

const { config } = require('../util/config');

class MusicPlayer {
    /**
     * 
     * @param {Guild} guild 
     */
    constructor(guild) {
        /**
         * @type {MusicData[]}
         */
        this.queue = [];
        /**
         * @type {MusicData[]}
         */
        this.searchResults = null;
        /**
         * @type {VoiceConnection}
         */
        this.voiceConnection = null;
        /**
         * @type {Message}
         */
        this.skipMessage = null;
        /**
         * @type {StreamDispatcher}
         */
        this.dispatcher = null,
        /**
         * @type {String}
         */
        this.textChannel = '';
        /**
         * @type {Guild}
         */
        this.guild = guild;
    }
    /**
     * Adds song to queue
     * @param {MusicData} musicData
     */
    add(musicData) {
        this.queue.push(musicData);
    
        if (this.queue.length == 1) {
            this.play(this.queue[0]);
        }
    }
    /**
     * Clears queue
     */
    clear() {
        this.queue = [];
        if (this.dispatcher) {
            this.dispatcher.end();
        }
    }
    /**
     * Gets song at top of queue
     * @returns {MusicData}
     */
    get() {
        return this.queue[0];
    }
    /**
     * Used to skip current playing song
     */
    skip() {
        if (this.dispatcher) {
            this.dispatcher.end();
        }
    }
    /**
     * This plays music based on music data sent in
     * @param {MusicData} musicData
     */
    play(musicData) {
        if (!this.voiceConnection || !musicData) {
            return;
        }
        
        if (this.voiceConnection == null) { 
            return;
        }
    
        if (ytdl.validateURL(musicData.url)) {
            if (this.guild) {
                /**
                 * @type {TextChannel}
                 */
                const channel = this.guild.channels.get(this.textChannel);
                
                if (channel) {
                    let embed = new MessageEmbed();
                    embed.setColor(0x8754ff);
                    embed.setTimestamp();
                    embed.setFooter("love, your friendly bot");
                    embed.setTitle('Now Playing');
                    embed.setImage(musicData.thumbnail);
                    embed.setDescription(`[${musicData.title}](${musicData.url})\nRequested by ${musicData.requestor.toString()}`);
                    channel.send({embed});
                }
            }

            const stream = ytdl(musicData.url, { filter: 'audioonly' });

            this.dispatcher = this.voiceConnection.play(stream);

            this.dispatcher.on('error', (err) => { console.log(err); });
            
            this.dispatcher.on('end', () => {                    
                this.dispatcher = null;
                
                this.queue.shift();
                if (this.get()) {
                    this.play(this.get());          
                }
                else {
                    this.voiceConnection.channel.leave();
                    this.voiceConnection = null;
                    this.searchResults = null;
                    this.skipMessage = null;
                }
            });
        }
    }
    /**
     * Stops bot completely
     */
    stop() {
        if (this.dispatcher) {
            this.dispatcher.end();
        }
    }
    /**
     * @returns {Boolean}
     */
    is_playing() {
        return this.dispatcher != null;
    }

}

class MusicData {
    constructor() {
        /**
         * @type {String}
         */
        this.url = '';
        
        /**
         * @type {String}
         */
        this.title = '';
        
        /**
         * @type {String}
         */
        this.thumbnail = '';
        
        /**
         * @type {String}
         */
        this.videoId = '';
        
        /**
         * @type {GuildMember}
         */
        this.requestor = '';
    }
}

module.exports = MusicPlayer;
