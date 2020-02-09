const CHANNELS = {
    // TWITCHGLOBALEMOTES: 0,
    JERMA: 23936415,
    VINESAUCE: 25725272,
    MOONMOON: 121059319,
};

const SELECTORS = {
    MAIN: 'div[role=main]',
    CONVERSATIONS: 'div[aria-label=Conversations]',
    MESSAGES: 'div[aria-label=Messages] > div[id^=js_]',
    SPANS: 'div[data-tooltip-content][data-hover=tooltip] div[aria-label] span',
};

const TWITCHGLOBALEMOTES = {
    'MTE.channel.TWITCHGLOBALEMOTES': {
        channel_name: "Twitch",
        channel_id: 0,
        emotes: [
            { code: "Kappa", id: 25 },
            { code: "DansGame", id: 33 },
            { code: "SwiftRage", id: 34 },
            { code: "Kreygasm", id: 41 },
            { code: "BibleThump", id: 86 },
            { code: "PogChamp", id: 88 },
            { code: "ResidentSleeper", id: 245 },
            { code: "4Head", id: 354 },
            { code: "FailFish", id: 360 },
            { code: "BabyRage", id: 22639 },
            { code: "WutFace", id: 28087 },
            { code: "KappaPride", id: 55338 },
            { code: "NotLikeThis", id: 58765 },
            { code: "SeemsGood", id: 64138 },
            { code: "KappaRoss", id: 70433 },
            { code: "cmonBruh", id: 84608 },
            { code: "Jebaited", id: 114836 },
            { code: "CoolStoryBob", id: 123171 },
            { code: "LUL", id: 425618 },
            { code: "PowerUpR", id: 425671 },
            { code: "PowerUpL", id: 425688 }
        ]
    }
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
    CHANNELS,
    SELECTORS,
    TWITCHGLOBALEMOTES,
    LOGLEVEL,
    MESSAGETYPES,
};