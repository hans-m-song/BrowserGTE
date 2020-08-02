import {BetterTTV} from './BetterTTV';
import {EmoteConfig} from './Emote';

interface Data {
  channelEmotes: EmoteConfig[];
  sharedEmotes: EmoteConfig[];
}

export class BetterTTVChannel extends BetterTTV {
  channelURL(id: string) {
    return `https://api.betterttv.net/3/users/${id}`;
  }

  parseData(data: unknown) {
    const {channelEmotes, sharedEmotes} = data as Data;
    return [...channelEmotes, ...sharedEmotes];
  }
}
