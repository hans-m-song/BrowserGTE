import {Emote} from '@channels/Emote';
import {ChannelLoader} from './ChannelLoader';
import {DEFAULT_CONFIG, ParserConfig, ParserConfigType} from './config';

export class Parser {
  compiledEmotes: {[code: string]: Emote} = {};
  emotes: Emote[];
  channelLoader: ChannelLoader | null = null;

  constructor(config: ParserConfig = DEFAULT_CONFIG) {
    this.emotes = [];
    const {type, emotes, channels} = config;
    switch (type) {
      case ParserConfigType.Loader: {
        this.channelLoader = new ChannelLoader(channels);
        break;
      }
      case ParserConfigType.Storage: {
        this.compiledEmotes = Object.values(emotes).reduce(
          (compiledEmotes, config) => ({
            ...compiledEmotes,
            [config.code]: new Emote(config),
          }),
          {} as {[code: string]: Emote},
        );
        break;
      }
      default: {
        console.error('Invalid configuration', config);
        throw new Error('Invalid configuration');
      }
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
    return {
      emotes: this.channelLoader?.compiledEmotes || this.compiledEmotes,
      channels:
        this.channelLoader?.channels.map((channel) => {
          const {id, name, provider} = channel;
          return {id, name, provider};
        }) || [],
    };
  }
}
