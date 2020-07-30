import {TwitchEmotes} from './TwitchEmotes';

const TWITCHGLOBALEMOTES = {
  emotes: [
    {code: 'Kappa', id: 25},
    {code: 'DansGame', id: 33},
    {code: 'SwiftRage', id: 34},
    {code: 'Kreygasm', id: 41},
    {code: 'BibleThump', id: 86},
    {code: 'PogChamp', id: 88},
    {code: 'ResidentSleeper', id: 245},
    {code: '4Head', id: 354},
    {code: 'FailFish', id: 360},
    {code: 'BabyRage', id: 22639},
    {code: 'WutFace', id: 28087},
    {code: 'KappaPride', id: 55338},
    {code: 'NotLikeThis', id: 58765},
    {code: 'SeemsGood', id: 64138},
    {code: 'KappaRoss', id: 70433},
    {code: 'cmonBruh', id: 84608},
    {code: 'Jebaited', id: 114836},
    {code: 'CoolStoryBob', id: 123171},
    {code: 'LUL', id: 425618},
    {code: 'PowerUpR', id: 425671},
    {code: 'PowerUpL', id: 425688},
  ],
};

export class TwitchEmotesGlobal extends TwitchEmotes {
  constructor(data) {
    super({...data, provider: 'TwitchEmotes'});
  }

  async loadData() {
    return TWITCHGLOBALEMOTES;
  }

  channelURL(id) {
    return `https://api.twitchemotes.com/api/v4/channels/${id}`;
  }

  emoteURL(id) {
    return `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`;
  }
}
