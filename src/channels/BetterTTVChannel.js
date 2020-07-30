const BetterTTV = require('./BetterTTV');

class BetterTTVChannel extends BetterTTV {
  channelURL(id) {
    return `https://api.betterttv.net/3/users/${id}`;
  }

  parseData(data) {
    return {
      emotes: [...data.channelEmotes, ...data.sharedEmotes],
    };
  }
}

module.exports = BetterTTVChannel;
