const Channel = require('./Channel');

class BetterTTV extends Channel {
  constructor(data) {
    super({...data, provider: 'BetterTTV'});
  }

  channelURL(id) {
    return `https://api.betterttv.net/3/cached/users/twitch/${id}`;
  }

  emoteURL(id) {
    return `https://cdn.betterttv.net/emote/${id}/1x`;
  }

  parseData(data) {
    return {emotes: data.channelEmotes};
  }
}

module.exports = BetterTTV;
