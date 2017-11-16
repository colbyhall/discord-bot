/**
 * Used for temp bans and other features
 */
class BasicTime {
    /**
     * 
     * @param {String} time 
     */
    constructor(time) {
        /**
         * Number of type time
         * @type {Number}
         */
        this.number = 0;

        /**
         * Type of time limited to ['m', 'h', 'd']
         * @type {String}
         */
        this.type = 'm'

        if (BasicTime.isValid(time)) {
            this.number = parseInt(time.substr(0, time.length - 1, 10));
            this.type = time.charAt(time.length - 1);
        }
    }

    /**
     * Checks if the string can be parsed
     * @param {String} time
     * @returns {Boolean}
     */
    static isValid(time) {
        return (time.contains('m') || time.contains('h') || time.contains('d')) && parseInt(time.substr(0, time.length - 1, 10)) != NaN;
    }
}

module.exports = BasicTime;