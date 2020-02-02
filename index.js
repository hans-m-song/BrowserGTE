// ==UserScript==
// @name         Messenger Browser GTE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.messenger.com/t/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/hans-m-song/BrowserGTE/master/index.js
// updateURL     https://raw.githubusercontent.com/hans-m-song/BrowserGTE/master/index.js
// ==/UserScript==

window.initBrowserGTE = () => {
    console.log('initcustomgte')

    const emotes = {
        'Kappa': '25',
        'DansGame': '33',
        'SwiftRage': '34',
        'Kreygasm': '41',
        'BibleThump': '86',
        'PogChamp': '88',
        'ResidentSleeper': '245',
        '4Head': '354',
        'FailFish': '360',
        'BabyRage': '22639',
        'WutFace': '28087',
        'KappaPride': 55338,
        'NotLikeThis': '58765',
        'SeemsGood': 64138,
        'KappaRoss': 70433,
        'cmonBruh': 84608,
        'Jebaited': '114836',
        'CoolStoryBob': 123171,
        'LUL': '425618',
        'PowerUpR': 425671,
        'PowerUpL': 425688,
    };

    const img = (name, id) => `<img
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
        >`;

    const applyEmotesToMessage = (message) => {
        Object.keys(emotes)
            .forEach(name => {
                const matcher = new RegExp(name, "g");
                if (matcher.test(message.innerText)) {
                    message.innerHTML = message.innerHTML
                        .replace(matcher, img(name, emotes[name]));
                }
            });
    };

    const getMessageSpans = (limit = 30) => {
        const selectors = {
            container: 'div[aria-label=Messages] > div[id^=js_]',
            spans: 'div[data-tooltip-content][data-hover=tooltip] div[aria-label] span',
        };

        const container = document.querySelector(selectors.container);
        const spanList = Array.from(container.querySelectorAll(selectors.spans));
        return spanList
            .slice(spanList.length - limit, spanList.length);
    }

    const run = () => {
        const messageSpans = getMessageSpans();
        messageSpans
            .filter(Boolean)
            .forEach(message => applyEmotesToMessage(message));
    };

    const interval = setInterval(() => {
        run();
    }, 2000);

    const cancel = () => clearInterval(interval);

    return {
        interval,
        cancel,
        emotes,
        img,
        applyEmotesToMessage,
        getMessageSpans,
        run,
    };
}

window.initBrowserGTE();