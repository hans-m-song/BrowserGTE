const { compose } = require('../util/message').background;
const Parser = require('./Parser');
const { MESSAGETYPES } = require('../util/constants');

let parser, initializing = false;

const waitForInit = () => new Promise((resolve) => {
    const interval = setInterval(() => {
        if (parser) {
            clearInterval(interval);
            resolve(parser);
        }
    }, 100);
});

const initParser = () => new Promise((resolve) => {
    if (!parser && !initializing) {
        console.log('initializing parser');
        initializing = true;
        new Parser()
            .init()
            .then((initializedParser) => {
                parser = initializedParser;
                resolve(initializedParser);
            })
            .catch((error) => console.warn(error));
    } else if (!parser && initializing) {
        console.log('waiting for parser to initialize');
        waitForInit()
            .then((parser) => resolve(parser));
    } else {
        resolve(parser);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    initParser()
        .then((parser) => {
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
                console.warn(error, message, sender);
                console.error(JSON.stringify(error, Object.getOwnPropertyNames(error)), JSON.stringify(message), sender);
                sendResponse(compose(MESSAGETYPES.NACK));
            }
        });

    return true;
});
