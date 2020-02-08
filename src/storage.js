const { TWITCHGLOBALEMOTES, CHANNELS } = require('./constants');
const { createURL } = require('./utils');

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

const updateChannelData = async (name, id) => {
    const endpoint = createURL.channel(id);

    const response = await fetch(endpoint, { mode: 'no-cors' }); // TODO handle exceptions
    const data = await response.json();

    const storableObject = { [createURL.storage('channel', name)]: data };
    await storage.set(storableObject);

    return storableObject;
};

const loadData = async () => {
    const storageData = await storage.list();

    const pendingRequests = Object.keys(CHANNELS)
        .map(async (name) => {
            const storageURL = createURL.storage('channel', name);
            if (!storageData[storageURL]) { // TODO refetch if time delta exceeds threshold
                storageData[storageURL] = await updateChannelData(name, CHANNELS[name]);
            }
        });

    const globalEmoteStorageURL = createURL.storage('channel', 'TWITCHGLOBALEMOTES');
    if (!storageData[globalEmoteStorageURL]) {
        await storage.set(TWITCHGLOBALEMOTES);
    }
    Object.assign(storageData, TWITCHGLOBALEMOTES);

    await Promise.all(pendingRequests);
    return storageData;
};

module.exports = {
    storage,
    updateChannelData,
    loadData,
}