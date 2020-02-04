const { CHANNELS } = require('./constants');
const { url, storage } = require('./utils');

class Emote {

    constructor(config) {
        this.code = config.code;
        this.id = `${config.id}`;
        this.src = config.src;
        this.rgx = new RegExp(`(^|\\s)${this.code}($|\\s)`, "g");
    }

    element() {
        return ` <img
            class="GTEEmote"
            src="${this.src}"
            alt="${this.code}"
            gte-tipsy-text="Emote: ${this.code}"
            style="
                display: inline !important;
                height: auto !important;
                width: auto !important;
                max-height: 100% !important;
                opacity: 1 !important;
                outline: 0px !important;
                border: 0px !important;
                margin: 0px !important;
                padding: 0px !important;
                z-index: auto !important;
                visibility: visible !important;"
            > `;
    }

    test(value) {
        return this.rgx.test(value);
    }
}

const getChannel = async (channel, id) => {
    const stored = await storage.get(`MTE.api.${CHANNELS[channel]}`);
}

const channels = async (name) => {
    const emotes = Object.keys(CHANNELS).reduce(async (collector, channel) => {
        const accumulator = await collector;
        const response = await storage.get(`MTE.api.${CHANNELS[channel]}`);
        response.emotes.forEach(emote => accumulator.push(new Emote({
            ...emote,
            src: url.emote(emote.id),
        })))
        return accumulator;
    }, Promise.resolve([]));
}