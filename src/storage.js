const { TWITCHGLOBALEMOTES, CHANNELS } = require('./constants');
const { createURL } = require('./utils');

const promisify = (func, data) => {
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

const updateChannelData = async (name, id) => {
    const endpoint = createURL.channel(id);

    const response = await fetch(endpoint); // TODO handle exceptions
    const data = await response.json();

    const storableObject = { [createURL.storage('channel', name)]: data };
    await storage.set(storableObject);

    return storableObject;
};

const loadGlobalTwitchEmotesData = async () => {
    await storage.set(TWITCHGLOBALEMOTES);
    return TWITCHGLOBALEMOTES;
};

const loadData = async () => {
    const storageData = await storage.list();

    const pendingRequests = Object.keys(CHANNELS)
        .map(async (name) => {
            if (!storageData[createURL.storage('channel', name)]) { // TODO refetch if time delta exceeds threshold
                const data = await updateChannelData(name, CHANNELS[name]);
            }
        });

    if (!storageData[createURL.storage('channel', 'TWITCHGLOBALEMOTES')]) {
        pendingRequests.push(loadGlobalTwitchEmotesData());
    }

    return await Promise.all(pendingRequests);
};

module.exports = {
    storage,
    updateChannelData,
    loadData,
}