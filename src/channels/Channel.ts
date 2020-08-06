import {Emote, EmoteConfig} from './Emote';

interface Data {
  emotes: EmoteConfig[];
}

export interface ChannelConfig {
  id: string;
  name: string;
  provider: string;
}

export class Channel {
  id: string;
  name: string;
  provider: string;
  emotes: Emote[];

  constructor(data: ChannelConfig) {
    this.id = data.id;
    this.name = data.name;
    this.provider = data.provider;
    this.emotes = [];
  }

  // need to provide functions for at least:
  // url to fetch channel from
  // channelURL: (id: string) => string
  // url to fetch emote image from
  // emoteURL: (id: string) => string

  // initialize emotes for this channel
  async init() {
    console.log(`initializing channel ${this.provider}.${this.name}`);
    const data = await this.loadData();
    this.emotes = data.map((config) => this.createEmote(config));
    return this;
  }

  channelURL(id: string): string {
    console.warn('need to override channelURL');
    return id;
  }

  emoteURL(id: string): string {
    console.warn('need to override emoteURL');
    return id;
  }

  // load data from storage or fetch from api and save to storage if none is found
  async loadData(): Promise<EmoteConfig[]> {
    const endpoint = this.channelURL(this.id);
    const response = await fetch(endpoint);

    if (response.status !== 200) {
      console.warn(
        `Invalid response from fetch at ${endpoint}: ${
          response.status
        }, ${await response.text()}`,
      );
      return [];
    }

    const data = await response.json();
    return this.parseData(data);
  }

  // formatting data retrieved from endpoint into the form { emotes: Array<{ code: string, id: string }> }
  parseData(data: unknown): EmoteConfig[] {
    return (data as Data).emotes;
  }

  // create emote from formatted data emote
  createEmote(emote: EmoteConfig) {
    return new Emote({
      ...emote,
      src: this.emoteURL(emote.id),
      provider: this.provider,
    });
  }

  toJSON(): ChannelConfig & Data {
    return {
      id: this.id,
      name: this.name,
      provider: this.provider,
      emotes: this.emotes.map((emote) => emote.toJSON()),
    };
  }
}
