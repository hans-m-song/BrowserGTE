const Channel = require('./Channel');

class BetterTTV extends Channel {

    constructor(data) {
        super({ ...data, provider: 'BetterTTV' });
    }

    channelURL(id) {
        return `https://api.betterttv.net/2/channels/${id}`;
    }

    emoteURL(id) {
        return `https://cdn.betterttv.net/emote/${id}/1x`;   
    }

}

module.exports = BetterTTV;