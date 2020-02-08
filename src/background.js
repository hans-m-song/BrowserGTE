const { createURL, storage } = require('./utils');
const { send, compose } = require('./message').background;
const { MESSAGETYPES, CHANNELS, TWITCHGLOBALEMOTES } = require('./constants');

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

    await Promise.all(pendingRequests);
};



const run = async () => {
    await loadData();
};

chrome.runtime.onInstalled.addListener(() => {
    console.log('installed background');

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const logLevel = message.level;

        switch (message.header) {
            case MESSAGETYPES.MESSAGE.RAW: {
                console.log('request to process message', message);
                break;
            };
            case MESSAGETYPES.MESSAGE.PROCESSED:
            case MESSAGETYPES.FETCH.REQUEST: {
                // TODO handle this if needed
            };
            case MESSAGETYPES.FETCH.RESPONSE:
            case MESSAGETYPES.ACK:
            case MESSAGETYPES.NACK:
            default: {
                console[logLevel]('unhandled message', message, sender);
                sendResponse(compose(MESSAGETYPES.NACK));
            };
        }
    });

    run();
});
