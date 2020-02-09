const { loadData } = require('./storage');
const { compose } = require('./message').background;
const { Parser } = require('./parser');
const { MESSAGETYPES } = require('./constants');

let initParser;


const init = () => {
    console.log('background script installed');

    initParser = new Promise((resolve) =>
        loadData()
            .then((data) => {
                console.log('loaded data', data)
                resolve(new Parser(data));
            }));
};

const handleMessage = async (message, sender, sendResponse) => {
    const parser = await initParser;
    
    const logLevel = message.level || 'log';

    // TODO handle adding new channels, custom emotes, etc
    try {
        switch (message.header) {
            case MESSAGETYPES.MESSAGE.RAW: {
                console[logLevel]('message.raw', message);
                const result = parser.process(message.data);
                sendResponse(compose(MESSAGETYPES.MESSAGE.PROCESSED, result));
                break;
            };
            default: {
                throw new Error('unhandled message type');
            };
        }
    } catch (error) {
        console.error(error, message, sender);
        sendResponse(compose(MESSAGETYPES.NACK));
    }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
    handleMessage(message, sender, sendResponse));

chrome.runtime.onInstalled.addListener(() =>
    init());