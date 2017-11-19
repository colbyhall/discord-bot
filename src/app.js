const { ClientModes, CreativeClient, Arguments } = require('./types');
const { tokens } = require('./util/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const client = new CreativeClient();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000);

app.use(require('./routes')(client));

client.login(tokens.discord);
