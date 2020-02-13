const { Channel } = require('./Channel');

class BetterTTV extends Channel {

    channelURL(id) {
        return `https://api.betterttv.net/2/channels/${id}`;
    }

    emoteURL(id) {
        return `https://cdn.betterttv.net/emote/${id}/1x`;   
    }

}

module.exports = BetterTTV;