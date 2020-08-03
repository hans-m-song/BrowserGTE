import {Channel} from './Channel';
import {Emote, EmoteConfig} from './Emote';

interface Data {
  sets: Array<{
    emoticons: Array<{
      name: string;
      id: string;
      urls: {[key: string]: string};
    }>;
  }>;
}

export class FrankerFacez extends Channel {
  parseData(data: unknown) {
    return Object.values((data as Data).sets).reduce((emotes, set) => {
      set.emoticons.forEach((emote) =>
        emotes.push({
          code: emote.name,
          id: emote.id,
          src: emote.urls['1'],
          provider: '',
        }),
      );
      return emotes;
    }, [] as EmoteConfig[]);
  }

  channelURL(id: string) {
    return `https://api.frankerfacez.com/v1/room/${id}`;
  }

  createEmote(emote: EmoteConfig) {
    return new Emote({
      ...emote,
      provider: this.provider,
    });
  }
}
