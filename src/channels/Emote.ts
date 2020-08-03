import {createEmoteEl, createRgx} from '@util/functions';

export interface EmoteConfig {
  code: string;
  id: string;
  src?: string;
  provider?: string;
}

export class Emote {
  code: string;
  id: string;
  src: string;
  provider: string;
  rgx: RegExp;
  element: string;

  constructor(config: EmoteConfig) {
    this.code = config.code;
    this.id = config.id;
    this.src = config.src || '';
    this.provider = config.provider || '';
    this.rgx = createRgx(this.code);
    this.element = createEmoteEl(this.code, this.src, this.provider);
  }

  test(value: string) {
    return this.rgx.test(value);
  }

  toJSON() {
    return {
      code: this.code,
      id: this.id,
    };
  }
}
