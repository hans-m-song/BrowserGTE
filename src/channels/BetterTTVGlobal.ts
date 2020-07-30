import {BetterTTV} from './BetterTTV';

export class BetterTTVGlobal extends BetterTTV {
  constructor(data) {
    super({...data, provider: 'BetterTTV'});
  }

  channelURL() {
    return `https://api.betterttv.net/3/cached/emotes/global`;
  }

  parseData(data) {
    return {emotes: data};
  }
}
