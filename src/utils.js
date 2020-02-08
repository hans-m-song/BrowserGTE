const createURL = {
    channel: (id) => `https://api.twitchemotes.com/api/v4/channels/${id}`,
    emote: (id) => `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`,
    storage: (type, name) => `MTE.${type}.${name}`,
};

const promisify = (func, data) => {
    console.log(func, data);
    return new Promise((resolve, reject) =>
        chrome.storage.sync[func](data, (result) => chrome.runtime.lastError
            ? reject(chrome.runtime.lastError)
            : resolve(result)));
}

const storage = {
    set: (data) => promisify('set', data),
    get: (key) => promisify('get', key),
    list: () => promisify('get', null),
    remove: (key) => promisify('remove', key),
    clear: () => promisify('clear'),
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

module.exports = {
    createURL,
    storage,
    waitForEl,
};