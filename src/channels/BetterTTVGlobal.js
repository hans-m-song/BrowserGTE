const BetterTTV = require('./BetterTTV');

class BetterTTVGlobal extends BetterTTV {

    constructor(data) {
        super({ ...data, provider: 'BetterTTV' });
    }

    channelURL() {
        return `https://api.betterttv.net/2/emotes`;
    }

}

module.exports = BetterTTVGlobal;