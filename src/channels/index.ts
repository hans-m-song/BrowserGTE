import {BetterTTV} from './BetterTTV';
import {BetterTTVChannel} from './BetterTTVChannel';
import {BetterTTVGlobal} from './BetterTTVGlobal';
import {Channel, ChannelConfig} from './Channel';
import {Emote, EmoteConfig} from './Emote';
import {FrankerFacez} from './FrankerFacez';
import {TwitchEmotes} from './TwitchEmotes';
import {TwitchEmotesGlobal} from './TwitchEmotesGlobal';

type ProviderTypes =
  | typeof BetterTTV
  | typeof BetterTTVChannel
  | typeof BetterTTVGlobal
  | typeof FrankerFacez
  | typeof TwitchEmotes
  | typeof TwitchEmotesGlobal;

type Providers =
  | BetterTTV
  | BetterTTVChannel
  | BetterTTVGlobal
  | FrankerFacez
  | TwitchEmotes
  | TwitchEmotesGlobal;

type ProviderMap = {[key: string]: ProviderTypes};

const providers: ProviderMap = {
  BetterTTV,
  BetterTTVChannel,
  BetterTTVGlobal,
  FrankerFacez,
  TwitchEmotes,
  TwitchEmotesGlobal,
};

export {
  providers,
  ProviderTypes,
  Providers,
  Channel,
  ChannelConfig,
  Emote,
  EmoteConfig,
};
