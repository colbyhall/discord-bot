const { ClientModes, CreativeClient, Arguments } = require('./types');
const { tokens } = require('./util/config');

const client = new CreativeClient();

/**
 * Client is Shipping by default
 * This code is for when starting up the process
 * Example: node app.js -debug
 */
process.argv.forEach((val, index, array) => {
    if (val.startsWith('-')) {
        const command = val.substr(1).toLowerCase();

        switch (command) {
            case 'debug': 
                client.mode = ClientModes.DEBUG;
                break;
            case 'development': 
                client.mode = ClientModes.DEVELOPMENT;
                break;
            case 'shipping': 
                client.mode = ClientModes.SHIPPING;
                break;
        }
    }
});

/**
 * Logs bot into the discord api using discord.js
 * Uses the tokens.json file
 */
client.login(tokens.discord);
