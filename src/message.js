const compose = (header, sender, data) => ({ header, sender, data });

const background = {
    send: (header, data) => new Promise((resolve) =>
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
            chrome.tabs.sendMessage(tabs[0].id, compose(header, 'background', data), (response) => 
                resolve(response)))),
    compose: (header, data) => compose(header, 'background', data),
};

const content_script = {
    send: (header, data) => new Promise((resolve) => 
        chrome.runtime.sendMessage(compose(header, 'content_script', data), (response) => 
            resolve(response))),
    compose: (header, data) => compose(header, 'content_script', data),
};

module.exports = { background, content_script, compose };