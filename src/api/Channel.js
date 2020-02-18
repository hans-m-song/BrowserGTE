const { storage } = require('../storage');
const { createEmoteEl, createRgx } = require('../utils');

class Emote {

    constructor(code, id, src, provider) {
        this.code = code;
        this.id = `${id}`;
        this.src = src;
        this.provider = provider;
        this.rgx = createRgx(this.code);
        this.element = createEmoteEl(this.code, this.src, this.provider);
    }

    test(value) {
        return this.rgx.test(value);
    }
    
}

class Channel {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.provider = data.provider;
        this.storagePath = `MTE.${this.provider}.${this.name}`;
    }

    // need to provide functions for at least:
    // url to fetch channel from
    // channelURL: (id: string) => string
    // url to fetch emote image from
    // emoteURL: (id: string) => string

    // initialize emotes for this channel
    async init() {
        const data = await this.loadData();

        this.emotes = data.emotes
            .map((emote) => this.createEmote(emote));
        console.log(`channel ${this.storagePath} initialized`, this);
    }

    // load data from storage or fetch from api and save to storage if none is found
    async loadData() {
        const storageData = await storage().list();

        if (!storageData[this.storagePath]) {
            const endpoint = this.channelURL(this.id);
            const response = await fetch(endpoint);
            const data = await response.json();
            const parsedData = this.parseData(data);
            await storage().set({ [this.storagePath]: parsedData });
            return parsedData;
        }

        return storageData[this.storagePath];
    }

    // formatting data retrieved from endpoint into the form { emotes: Array<{ code: string, id: string }> }
    parseData(data) {
        return { emotes: data.emotes };
    }

    // create emote from formatted data emote
    createEmote(emote) {
        return new Emote(emote.code, emote.id, this.emoteURL(emote.id), this.provider);
    }

}

module.exports = {
    Emote,
    Channel,
};