import {ChannelConfig} from '@channels/Channel';
import {Emote, EmoteConfig} from '@channels/Emote';
import {ChannelLoader} from './ChannelLoader';
import {DEFAULT_CONFIG} from './config';

export type LoaderConfig = {channels: ChannelConfig[]};

export type StorageConfig = {emotes: EmoteConfig[]};

export type ParserConfig = LoaderConfig | StorageConfig;

export class Parser {
  compiledEmotes: {[code: string]: Emote} = {};
  emotes: Emote[];
  channelLoader: ChannelLoader | null = null;

  constructor(config: ParserConfig = DEFAULT_CONFIG) {
    this.emotes = [];
    if ((config as LoaderConfig).channels) {
      this.channelLoader = new ChannelLoader((config as LoaderConfig).channels);
    } else if ((config as StorageConfig).emotes) {
      this.compiledEmotes = (config as StorageConfig).emotes.reduce(
        (compiledEmotes, config) => ({
          ...compiledEmotes,
          [config.code]: new Emote(config),
        }),
        {} as {[code: string]: Emote},
      );
    } else {
      console.error('Invalid configuration', config);
      throw new Error('Invalid configuration');
    }
  }

  async init() {
    if (this.channelLoader) {
      await this.channelLoader
        .init()
        .catch((error) =>
          console.error(
            `error initalizing channel: ${JSON.stringify(
              error,
              Object.getOwnPropertyNames(error),
            )}`,
          ),
        );

      // TODO settings, custom emotes, etc
      console.log('parser initialized by loader', this);
    } else {
      console.log('parser initialized by local storage', this);
    }

    this.emotes = Object.values(
      this.channelLoader?.compiledEmotes || this.compiledEmotes,
    );

    return this;
  }

  process(message: string) {
    return this.emotes.reduce(
      (builder, emote) =>
        emote.test(builder)
          ? builder.replace(emote.rgx, emote.element)
          : builder,
      message,
    );
  }

  toJSON() {
    return this.channelLoader?.compiledEmotes || this.compiledEmotes;
  }
}
