const ChannelLoader = require('../channels/ChannelLoader');
const { DEFAULT_CONFIG } = require('./config');

class Parser {

    constructor(config = DEFAULT_CONFIG) {
        this.channelLoader = new ChannelLoader(config.channels);
    }
    
    async init() {
        await this.channelLoader.init();
        this.emotes = this.channelLoader.emotes();
        // TODO settings, custom emotes, etc
        console.log('parser initialized', this);
        return this;
    }

    process(message) {
        return this.emotes
            .reduce((builder, emote) => emote.test(builder)
                ? builder.replace(emote.rgx, `$1${emote.element}$2`)
                : builder, message);
    }

}

module.exports = Parser;