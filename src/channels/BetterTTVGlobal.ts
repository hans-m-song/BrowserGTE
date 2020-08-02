import {BetterTTV} from './BetterTTV';
import {ChannelConfig} from './Channel';
import {EmoteConfig} from './Emote';

export class BetterTTVGlobal extends BetterTTV {
  constructor(data: ChannelConfig) {
    super({...data, provider: 'BetterTTV'});
  }

  channelURL() {
    return `https://api.betterttv.net/3/cached/emotes/global`;
  }

  parseData(data: unknown) {
    return data as EmoteConfig[];
  }
}
