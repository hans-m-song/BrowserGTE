import {Channel, ChannelConfig} from './Channel';
import {EmoteConfig} from './Emote';

interface Data {
  channelEmotes: EmoteConfig[];
}

export class BetterTTV extends Channel {
  constructor(data: ChannelConfig) {
    super({...data, provider: 'BetterTTV'});
  }

  channelURL(id: string) {
    return `https://api.betterttv.net/3/cached/users/twitch/${id}`;
  }

  emoteURL(id: string) {
    return `https://cdn.betterttv.net/emote/${id}/1x`;
  }

  parseData(data: unknown) {
    return (data as Data).channelEmotes;
  }
}
