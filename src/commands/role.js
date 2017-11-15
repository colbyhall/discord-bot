const Discord = require('discord.js');

const Arguments = require('../types/arguments'); 
const Message = Discord.Message;

const utils = require('../utils');

module.exports = {
    name: 'role',
    category: 'general',
    help: '`;role list` list roles that can be added\n`;role add role` can be used for adding a certain role\n`;role remove role` can be used for removing a certain role',         
    /**
     * @param {Message} message 
     * @param {Arguments} args 
     * @returns {Promise<Boolean>}
     */
    async execute(message, args) {

        if (args.length > 2 || args.length == 0) {
            utils.getCommands().get('help').execute(message, new Array(this.name));
            return false;
        }

        let guild = message.channel.guild;

        if(args[0] === 'list') {
            let embed = utils.getEmbed();
            
            embed.setTitle('Roles List')
            
            let description = '';
            
            for (let role of this.roles) {
                description += `${guild.roles.get(role).name}\n`;
            }
    
            embed.setDescription(description);
    
            message.channel.send({embed});
            return false;
        }
    
        if (!args[1]){
            utils.getCommands().get('help').execute(message, new Array(this.name));
            return false;
        }

        let role = guild.roles.find((elem) => {
            return args[1].toLowerCase() === elem.toString() || args[1].toLowerCase() === elem.name;
        });

        if (role) {
            if (!this.roles.includes(role.id)) {
                message.reply('haha nice try buck o');
                return true;
            }
            if (args[0] === 'add') {
                guild.members.get(message.author.id).addRole(role);
                message.reply('Welcome to the club bud.');
                return true;
            }
            else if(args[0] === 'remove') {
                guild.members.get(message.author.id).removeRole(role);
                message.reply('I guess we weren\'t really bubble buddies');
                return true;
            }
            else {
                message.reply('incorrect specification of add or remove');
            }
        }
        else {
            message.reply('could not find that role');
        }
        
        return false;
    }
}