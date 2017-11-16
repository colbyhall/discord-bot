const MusicPlayer = require('./musicplayer');
/**
 * Class used for commands
 */
class Arguments extends Array {

    constructor() {
        super();
        /**
         * Used incase we need to edit the music player
         * @type {MusicPlayer}
         */
        this.musicPlayer = null;
    }
    /**
     * Gets arguments as a whole string
     * @param {Number} start Used to start counting from front
     * @param {Number} back  Used to stop counting from back
     * @returns {String}
     * @constant
     */
    toString(start = 0, back = 0) {
        let result = '';

        for (let i = start; i < this.length - back; i++) {
            result += this[i];
            
            if (i != this.length - back - 1)
            {
                result += ' ';
            }
        }

        return result;
    }

}

module.exports = Arguments;