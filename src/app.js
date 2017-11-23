const { ClientModes, CreativeClient, Arguments } = require('./types');
const { tokens } = require('./util/config');

const client = new CreativeClient();

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

client.login(tokens.discord);
