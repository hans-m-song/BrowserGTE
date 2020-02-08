const { createURL, createImg, createRgx } = require('./utils');

class Emote {

    constructor(code, id, src) {
        this.code = code;
        this.id = `${id}`;
        this.src = src;
        this.rgx = createRgx(this.code);
        this.element = createImg(this.code, this.src);
    }

    test(value) {
        return this.rgx.test(value);
    }
}

class Channel {

    constructor(data) {
        this.id = data.channel_id;
        this.name = data.channel_name;
        this.emotes = data.emotes
            .map(emote => new Emote(emote.code, emote.id, createURL.emote(emote.id)));
        console.log(`channel ${this.name} initialized`, this);
    }

    process(message) {
        return this.emotes
            .reduce((builder, emote) => emote.test(builder)
                ? builder.replace(emote.rgx, `$1${emote.element}$2`)
                : builder, message);
    }

}

class Parser {

    constructor(data) {
        this.channels = Object.keys(data)
            .map((name) => new Channel(data[name]));
        console.log('parser initialized', this);
    }

    process(message) {
        return this.channels
            .reduce((builder, channel) => channel.process(builder), message);
    }

}

module.exports = {
    Parser,
};