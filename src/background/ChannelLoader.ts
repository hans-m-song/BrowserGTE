import {ChannelConfig} from '@channels/Channel';
import {Emote, EmoteConfig} from '@channels/Emote';
import {providers, Providers} from '@channels/Providers';
import {storage} from '@util/storage';

export interface StoredData {
  channels: {
    [name: string]: StoredChannel;
  };
}

interface StoredChannel {
  name: string;
  id: string;
  provider: string;
  emotes?: EmoteConfig[];
}

export class ChannelLoader {
  channels: Providers[];
  compiledEmotes: {[code: string]: Emote};

  constructor(channels: ChannelConfig[]) {
    this.channels = channels.map(
      (channel) => new providers[channel.provider](channel),
    );
    this.compiledEmotes = {};
  }

  async init() {
    const data = (await storage().list()) as StoredData;
    const channelsToLoad = [] as Promise<Providers>[];

    if (data.channels) {
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
    } else {
      await Promise.all(this.channels.map((channel) => channel.init()));
    }

    this.compiledEmotes = this.channels.reduce((emotes, channel) => {
      (channel.emotes || []).forEach((emote) => (emotes[emote.code] = emote));
      return emotes;
    }, {} as {[code: string]: Emote});

    return this;
  }

  async save() {
    const data = {channels: {}} as StoredData;

    this.channels.forEach(
      (channel) => (data.channels[channel.name] = channel.toJSON()),
    );

    console.log('storing channel data', data);

    await storage().set(data);
  }
}
