const { Client, Collection } = require('discord.js');
const Command = require('./command');
const ClientModes = require('./clientmodes');

class CreativeClient extends Client {
    
    constructor(options = {}) {
        super(options);
        
        /**
         * MusicPlayers across all guilds
         * @type {Collection<String, Command>}
         */
        this.musicPlayers = new Collection();
        
        /**
         * @type {ClientModes}
         */
        this.mode = ClientModes.SHIPPING;
        
        this.setup();
    }
    
    /**
     * @private
     */
    setup() {
        const Events = require('../events');
        this.on('ready', () => Events.ready(this));
        this.on('message', message => Events.message(this, message));
        this.on('messageDelete', message => Events.messageDelete(this, message));
        this.on('messageUpdate', (oldMessage, newMessage) => Events.messageUpdate(this, oldMessage, newMessage));
        this.on('guildMemberAdd', member => Events.guildMemberAdd(this, member));
        this.on('guildMemberRemove', member => Events.guildMemberRemove(this, member));
        this.on('messageReactionAdd', (messageReaction, user) => Events.messageReactionAdd(messageReaction, user));
        this.on('voiceStateUpdate', (oldMember, newMember) => Events.voiceStateUpdate(this, oldMember, newMember));
        this.on('guildCreate', guild => Events.guildCreate(this, guild));
        this.on('guildDelete', guild => Events.guildDelete(this, guild));
    }
}

module.exports = CreativeClient;