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
        const compiledEmotes = {};
        this.channels.forEach((channel) =>
            channel.emotes.forEach((emote) =>
                compiledEmotes[emote.code] = emote)); // overwrite duplicate emotes
        this.emotes = Object.values(compiledEmotes);
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