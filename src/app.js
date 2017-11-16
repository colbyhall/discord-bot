const { CreativeClient, ClientModes, Arguments } = require('./types');
const { tokens } = require('./util/config');

const client = new CreativeClient();

console.log(require('./types'))

process.argv.forEach((val, index, array) => {
    if (val.startsWith('-')) {
        let command = val.substr(1);

        switch (command) {
            case 'debug': {
                client.mode = ClientModes.DEBUG;
            }
        }
    }
});

client.login(tokens.discord);
