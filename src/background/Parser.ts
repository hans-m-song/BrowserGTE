import {Emote} from '../channels';
import {ChannelLoader} from './ChannelLoader';
import {DEFAULT_CONFIG} from './config';

export class Parser {
  emotes: Emote[];
  channelLoader: ChannelLoader;

  constructor(config = DEFAULT_CONFIG) {
    this.channelLoader = new ChannelLoader(config.channels);
    this.emotes = [];
  }

  async init() {
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

    this.emotes = this.channelLoader.emotes();
    // TODO settings, custom emotes, etc
    console.log('parser initialized', this);
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
}
