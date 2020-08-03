import {BetterTTV} from './BetterTTV';
import {BetterTTVChannel} from './BetterTTVChannel';
import {BetterTTVGlobal} from './BetterTTVGlobal';
import {FrankerFacez} from './FrankerFacez';
import {TwitchEmotes} from './TwitchEmotes';
import {TwitchEmotesGlobal} from './TwitchEmotesGlobal';

export type ProviderTypes =
  | typeof BetterTTV
  | typeof BetterTTVChannel
  | typeof BetterTTVGlobal
  | typeof FrankerFacez
  | typeof TwitchEmotes
  | typeof TwitchEmotesGlobal;

export type Providers =
  | BetterTTV
  | BetterTTVChannel
  | BetterTTVGlobal
  | FrankerFacez
  | TwitchEmotes
  | TwitchEmotesGlobal;

type ProviderMap = {[key: string]: ProviderTypes};

export const providers: ProviderMap = {
  BetterTTV,
  BetterTTVChannel,
  BetterTTVGlobal,
  FrankerFacez,
  TwitchEmotes,
  TwitchEmotesGlobal,
};
