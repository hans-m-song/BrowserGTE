class Channel {

    constructor(data) {

    }

    process(message) {
        return message;
    }

}

class Parser {

    constructor(data) {
        this.channels = Object.keys(data)
            .map((name) => new Channel(data[name]));
    }

    process(message) {
        return this.channels
            .reduce((builder, channel) => channel.process(builder), message);
    }

}

module.exports = {
    Parser,
};