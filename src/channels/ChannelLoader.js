const { storage } = require('../util/storage');
const Emote = require('./Emote');

const providers = {
    BetterTTV: require('./BetterTTV'),
    BetterTTVGlobal: require('./BetterTTVGlobal'),
    BetterTTVChannel: require('./BetterTTVChannel'),
    TwitchEmotes: require('./TwitchEmotes'),
    TwitchEmotesGlobal: require('./TwitchEmotesGlobal'),
    FrankerFacez: require('./FrankerFacez'),
}

class ChannelLoader {

    constructor(channels) {
        this.compiledEmotes = {};
        this.channels = channels.map((channel) =>
            new providers[channel.provider](channel));
    }

    async init() {
        const data = await storage().list();
        console.log('stored data', data );
        if (data.channels) {
            this.load(data);
        } else {
            await this.download();
        }
        return this;
    }

    async download() {
        console.log('downloading channel data');
        await Promise.all(this.channels.map((channel) => channel.init()));
        this.channels.forEach((channel) =>
            channel.emotes.forEach((emote) =>
                this.compiledEmotes[emote.code] = new Emote(emote)));
    }

    load(data) {
        console.log('loading stored data');
        this.compiledEmotes = data.channels.reduce((emotes, channel) => {
            channel.emotes.forEach((emote) => emotes[emote.code] = new Emote(emote));
            return emotes;
        }, {});
    }

    emotes() {
        return Object.values(this.compiledEmotes);
    }

    async save() {
        await storage().set({
            channels: this.channels.map((channel) => channel.toJSON())
        });
    }

}

module.exports = ChannelLoader;