const { LOGLEVEL } = require('./constants');

const compose = (header, sender, data = {}, level = LOGLEVEL.LOG) =>
    ({ header, level, sender, data });

const background = {
    send: (header, data, level) => new Promise((resolve) =>
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
            chrome.tabs.sendMessage(tabs[0].id, compose(header, 'background', data, level), (response) => 
                resolve(response)))),
    compose: (header, data, level) => compose(header, 'background', data, level),
};

const content_script = {
    send: (header, data, level) => new Promise((resolve) => 
        chrome.runtime.sendMessage(compose(header, 'content_script', data, level), (response) => 
            resolve(response))),
    compose: (header, data, level) => compose(header, 'content_script', data, level),
};

module.exports = { background, content_script, compose };