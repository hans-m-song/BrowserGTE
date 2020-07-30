import {storage} from '../util/storage';
import {BetterTTV} from './BetterTTV';
import {BetterTTVChannel} from './BetterTTVChannel';
import {BetterTTVGlobal} from './BetterTTVGlobal';
import {Emote} from './Emote';
import {FrankerFacez} from './FrankerFacez';
import {TwitchEmotes} from './TwitchEmotes';
import {TwitchEmotesGlobal} from './TwitchEmotesGlobal';

type Provider =
  | BetterTTV
  | BetterTTVGlobal
  | BetterTTVChannel
  | TwitchEmotes
  | TwitchEmotesGlobal
  | FrankerFacez;

const providers = {
  BetterTTV,
  BetterTTVGlobal,
  BetterTTVChannel,
  TwitchEmotes,
  TwitchEmotesGlobal,
  FrankerFacez,
};

export class ChannelLoader {
  channels: Provider[];
  compiledEmotes: {[code: string]: Emote};

  constructor(channels) {
    this.channels = channels.map(
      (channel) => new providers[channel.provider](channel),
    );
  }

  async init() {
    const data = await storage().list();
    const channelsToLoad = [];

    if (!data.channels) {
      await Promise.all(this.channels.map((channel) => channel.init()));
    } else {
      this.channels.forEach((channel) => {
        const storedChannel = data.channels[channel.name];
        if (storedChannel && storedChannel.emotes) {
          channel.emotes = storedChannel.emotes.map((emote) =>
            channel.createEmote(emote),
          );
        } else {
          channelsToLoad.push(channel.init());
        }
      });
      await Promise.all(channelsToLoad);
      await this.save();
    }

    this.compiledEmotes = this.channels.reduce((emotes, channel) => {
      (channel.emotes || []).forEach((emote) => (emotes[emote.code] = emote));
      return emotes;
    }, {});

    return this;
  }

  emotes() {
    return Object.values(this.compiledEmotes);
  }

  async save() {
    const data = {channels: {}};

    this.channels.forEach(
      (channel) => (data.channels[channel.name] = channel.toJSON()),
    );

    console.log('storing channel data', data);

    await storage().set(data);
  }
}
