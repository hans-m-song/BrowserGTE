const createURL = {
    channel: (id) => `https://api.twitchemotes.com/api/v4/channels/${id}`,
    emote: (id) => `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`,
    storage: (type, name) => `MTE.${type}.${name}`,
};

const waitForEl = (selector, interval = 100) => new Promise(resolve => {
    const intervalHandle = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(intervalHandle);
            resolve(element);
        }
    }, interval);
});

const createImg = (name, id, src) => ` <img
    src="${src}"
    alt="${name}"
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
    > `;

module.exports = {
    createURL,
    waitForEl,
    createImg,
};