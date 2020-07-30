// ==UserScript==
// @name         Messenger Browser GTE
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        *://www.messenger.com/t/*
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL  https://raw.githubusercontent.com/hans-m-song/BrowserGTE/master/index.js
// @updateURL    https://raw.githubusercontent.com/hans-m-song/BrowserGTE/master/index.js
// ==/UserScript==

class BrowserGTE {
  constructor(document, interval = 1000, limit = 30) {
    this.document = document;
    this.interval = interval;
    this.limit = limit;
  }

  channels = {
    global: 0,
    //jerma: 23936415,
    //vinesauce: 25725272,
    //moonmoon: 121059319,
  };

  globalEmotes = {
    emotes: [
      {code: 'Kappa', id: '25'},
      {code: 'DansGame', id: '33'},
      {code: 'SwiftRage', id: '34'},
      {code: 'Kreygasm', id: '41'},
      {code: 'BibleThump', id: '86'},
      {code: 'PogChamp', id: '88'},
      {code: 'ResidentSleeper', id: '245'},
      {code: '4Head', id: '354'},
      {code: 'FailFish', id: '360'},
      {code: 'BabyRage', id: '22639'},
      {code: 'WutFace', id: '28087'},
      {code: 'KappaPride', id: '55338'},
      {code: 'NotLikeThis', id: '58765'},
      {code: 'SeemsGood', id: '64138'},
      {code: 'KappaRoss', id: '70433'},
      {code: 'cmonBruh', id: '84608'},
      {code: 'Jebaited', id: '114836'},
      {code: 'CoolStoryBob', id: '123171'},
      {code: 'LUL', id: '425618'},
      {code: 'PowerUpR', id: '425671'},
      {code: 'PowerUpL', id: '425688'},
    ],
  };

  selectors = {
    container: 'div[aria-label=Messages] > div[id^=js_]',
    spans: 'div[data-tooltip-content][data-hover=tooltip] div[aria-label] span',
  };

  api = {
    channel: (id) => `https://api.twitchemotes.com/api/v4/channels/${id}`,
    emote: (id) => `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`,
    img: (name, id) => ` <img
            class="GTEEmote"
            src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0"
            alt="${name}"
            gte-tipsy-text="Emote: ${name}"
            style="
                display: inline !important;
                height: auto !important;
                width: auto !important;
                max-height: 100% !important;
                opacity: 1 !important;
                outline: 0px !important;
                border: 0px !important;
                margin: 0px !important;
                padding: 0px !important;
                z-index: auto !important;
                visibility: visible !important;"
            > `,
  };

  matcher = (name) => new RegExp(`(^|\\s)${name}($|\\s)`, 'g');

  get = async (path) => JSON.parse(JSON.parse(await GM.getValue(path, null)));

  set = async (path, content) => GM.setValue(path, JSON.stringify(content));

  getChannelEmotes = async (name) => {
    const storagePath = `BrowserGTE.channel.${name}`;
    console.log('retrieving from', storagePath);

    const stored = await this.get(storagePath);
    if (stored) return stored.emotes;

    if (name === 'global') {
      console.log('setting global emotes list');
      await this.set(storagePath, JSON.stringify(this.globalEmotes));
      return this.globalEmotes.emotes;
    }

    const url = this.api.channel(this.channels[name]);
    console.log('item not found, manually fetching at', url);
    const response = await fetch(url);
    const content = await response.text();

    if (response.status !== 200) {
      throw new Error('Error occurred fetching from api: ' + content);
    }

    await this.set(storagePath, content);
    return JSON.parse(content).emotes;
  };

  getMessageSpans = () => {
    const container = this.document.querySelector(this.selectors.container);
    if (!container) {
      return [];
    }

    const spanList = Array.from(
      container.querySelectorAll(this.selectors.spans),
    );
    return spanList.slice(spanList.length - this.limit, spanList.length);
  };

  applyEmotes = (span) => {
    this.emotes.forEach((emote) => {
      if (emote.matcher.test(span.innerText)) {
        console.log('matched', emote.code);
        span.innerHTML = span.innerHTML.replace(
          emote.matcher,
          this.api.img(emote.code, emote.id),
        );
      }
    });
  };

  init = async () => {
    this.emotes = await Object.keys(this.channels).reduce(async (acc, name) => {
      const list = await this.getChannelEmotes(name);
      console.log(list);
      list.forEach((emote) => {
        acc.push({
          matcher: this.matcher(emote.code),
          code: emote.code,
          id: emote.id,
        });
      });
      return acc;
    }, []);
  };

  run = () => {
    this.runner = setInterval(() => {
      this.getMessageSpans().forEach((span) => {
        if (!span) return;
        this.applyEmotes(span);
      });
    }, this.interval);
  };

  cancel = () => {
    clearInterval(this.runner);
  };
}

browserGTE = new BrowserGTE(document);

browserGTE.init().then(() => browserGTE.run());
