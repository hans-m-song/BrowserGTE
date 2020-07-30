import {Channel} from './Channel';

export class TwitchEmotes extends Channel {
  channelURL(id) {
    return `https://api.twitchemotes.com/api/v4/channels/${id}`;
  }

  emoteURL(id) {
    return `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`;
  }
}
