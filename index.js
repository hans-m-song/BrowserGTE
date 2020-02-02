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

    const emoteIds = {
        LUL: '425618',
        Jebaited: '114836',
        NotLikeThis: '58765',
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
        Object.keys(emoteIds)
            .forEach(name => {
                 const matcher = new RegExp(name, "g");
                 if (matcher.test(message.innerText)) {
                     message.innerHTML = message.innerHTML
                         .replace(matcher, img(name, emoteIds[name]));
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
        emoteIds,
        img,
        applyEmotesToMessage,
        getMessageSpans,
        run,
    };
}

window.initBrowserGTE();