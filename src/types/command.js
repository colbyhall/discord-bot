const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;
const MusicPlayer = require('../types/musicplayer');

/**
 * Typing of Command
 */
class Command {
    constructor()
    {
        /**
         * Name of command
         * @type {String}
         */
        this.name = '';
        /**
         * Help text of command
         * @type {String}
         */
        this.help = '';
        /**
         * Category of Command
         * @type {String}
         */
        this.category = '';
        /**
         * Roles used in command
         * @type {String[]}
         */
        this.roles = null;
        /**
         * True if we allow command through DM
         * @type {Boolean}
         */
        this.allowDM = false;
        /**
         * Used for changing music data
         * @type {MusicPlayer}
         */
        this.musicPlayer = null;
    }

    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) { }
}

module.exports = Command;