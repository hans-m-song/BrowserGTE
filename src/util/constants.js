const SELECTORS = {
    MAIN: 'div[role=main]',
    CONVERSATIONS: 'div[aria-label=Conversations]',
    MESSAGES: 'div[aria-label=Messages] > div[id^=js_]',
    SPANS: '[data-tooltip-content] > div > span',
};

const LOGLEVEL = Object.freeze({
    'ERROR' : 'error',
    'WARN' : 'warn',
    'LOG' : 'log',
});

const MESSAGETYPES = Object.freeze({
    'ACK': 'ACK',
    'NACK': 'NACK',
    'FETCH': {
        'REQUEST': 'FETCH.REQUEST',
        'RESPONSE': 'FETCH.RESPONSE',
    },
    'MESSAGE': {
        'RAW': 'MESSAGE.RAW',
        'PROCESSED': 'MESSAGE.PROCESSED',
    },
    'OPTIONS': {
        'SET': 'OPTIONS.SET',
        'GET': 'OPTIONS.GET',
    },
    'CHANNEL': {
        'UPDATE': 'CHANNEL.UPDATE',
        'ADD': 'CHANNEL.ADD',
        'REMOVE': 'CHANNEL.REMOVE',
    },
    'EMOTE': {
        'ADD': 'EMOTE.ADD',
        'REMOVE': 'EMOTE.REMOVE',
    },
    'STORAGE': 'STORAGE',
});

module.exports = {
    SELECTORS,
    LOGLEVEL,
    MESSAGETYPES,
};