const url = {
    channel: (id) => `https://api.twitchemotes.com/api/v4/channels/${id}`,
    emote: (id) => `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`,
};

const storage = {
    set: (data) =>
        new Promise((resolve, reject) => 
            chrome.storage.sync.set(data, () => 
                chrome.runtime.lastError
                    ? reject(chrome.runtime.lastError)
                    : resolve())),

    get: (key) =>
        new Promise((resolve, reject) =>
            chrome.storage.sync.get(key, (result) =>
                chrome.runtime.lastError
                    ? reject(chrome.runtime.lastError)
                    : resolve(result))),

    list: () =>
        new Promise((resolve, reject) => 
            chrome.storage.sync.get(null, (result) =>
                chrome.runtime.lastError
                    ? reject(chrome.runtime.lastError)
                    : resolve(result))),
};

const message = {
    toBackground: (data) =>
        new Promise((resolve) => 
            chrome.runtime.sendMessage(data, (response) => resolve(response))),
    toTab: (data) =>
        new Promise((resolve) =>
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
                chrome.tabs.sendMessage(tabs[0].id, data, (response) => 
                    resolve(response)))),
}

module.exports = {
    url,
    storage,
    message,
};