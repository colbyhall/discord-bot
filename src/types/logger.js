const fs = require('fs');
const LoggerType = require('./loggertype');

const WriteStream = fs.writeStream;

class Logger {
    
    constructor() {

        /**
         * @type { WriteStream }
         */

        this.writeStream = fs.createWriteStream(`../logs/${new Date(Date.now()).toISOString().replace(/:/, '.')}.log`);

    }

    /**
     * Logs a message to the type
     * @param { LoggerType } type 
     * @param { String } message 
     */
    log(type, message) {
        const currentDate = new Date(Date.now());

        const result = `[${currentDate.toISOString()}]${type}: ${message}`;

        console.log(result);
        this.writeStream.write(result + '\n');
    }

    /**
     * Logs to everyday
     * @param { String } message
     */
    log(message) {
        const currentDate = new Date(Date.now());

        const result = `[${currentDate.toISOString()}]${LoggerType.EVERYDAY}: ${message}`;

        console.log(result);
        this.writeStream.write(result + '\n');
    }
}

module.exports = Logger;