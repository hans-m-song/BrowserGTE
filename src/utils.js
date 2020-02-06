const url = {
    channel: (id) => `https://api.twitchemotes.com/api/v4/channels/${id}`,
    emote: (id) => `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`,
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

module.exports = {
    url,
    storage,
};