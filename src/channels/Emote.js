const { createEmoteEl, createRgx } = require('../util/utils');

class Emote {

    constructor(config) {
        this.code = config.code;
        this.id = config.id;
        this.src = config.src;
        this.provider = config.provider;
        this.rgx = createRgx(this.code);
        this.element = createEmoteEl(this.code, this.src, this.provider);
    }

    test(value) {
        return this.rgx.test(value);
    }

    toJSON() {
        return {
            code: this.code,
            id: this.id,
        };
    }
    
}

module.exports = Emote;