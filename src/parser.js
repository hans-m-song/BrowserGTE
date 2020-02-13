const API = require('./api/index');
const { DEFAULT_CONFIG } = require('./config');

class Parser {

    constructor(config = DEFAULT_CONFIG) {
        this.channels = config.channels
            .map((channel) => new API[channel.provider](channel));
        console.log('parser created', this);
    }
    
    async init() {
        await Promise.all(this.channels.map((channel) => channel.init()));
        console.log('parser intialized', this);
    }

    process(message) {
        return this.channels
            .reduce((builder, channel) => channel.process(builder), message);
    }

}

module.exports = Parser;