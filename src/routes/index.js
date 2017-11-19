const router = require('express').Router();
const { CreativeClient } = require('../types');

/**
 * 
 * @param { CreativeClient } client 
 */
module.exports = client => {

    router.get('/', (req, res) =>
    {
        res.send(JSON.stringify({
            err: '',
            uptime: client.uptime,
            userCount: client.users.array().length,
            guildCount: client.guilds.array().length
        }));
    });

    return router;
}