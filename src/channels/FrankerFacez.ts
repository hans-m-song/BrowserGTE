import {Channel} from './Channel';
import {Emote} from './Emote';

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
  parseData(data) {
    const emotes = Object.values((data as Data).sets).reduce((emotes, set) => {
      set.emoticons.forEach((emote) =>
        emotes.push({
          code: emote.name,
          id: emote.id,
          src: emote.urls['1'],
        }),
      );
      return emotes;
    }, [] as {code: string; id: string; src: string}[]);
    return {emotes};
  }

  channelURL(id) {
    return `https://api.frankerfacez.com/v1/room/${id}`;
  }

  createEmote(emote) {
    return new Emote({
      ...emote,
      provider: this.provider,
    });
  }
}
