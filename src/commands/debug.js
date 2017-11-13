const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

const jimp = require('jimp');

module.exports = {
    name: 'debug',
    category: 'debugging',
    help: 'debug command colby changes all the time',
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

        if (!utils.canUse(message.user, this)) return;

        const parsed = parseInt(args[0], 10);

        console.log(utils.getRankFromTotalPoints(parsed));

        return false;
    }
}