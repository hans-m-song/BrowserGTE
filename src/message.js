const compose = (header, sender, data) => ({ header, sender, data });

const background = (header, data) => new Promise((resolve) =>
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
        chrome.tabs.sendMessage(tabs[0].id, compose(header, 'background', data), (response) => 
            resolve(response))));

const content_script = (header, data) => new Promise((resolve) => 
    chrome.runtime.sendMessage(compose(header, 'content_script', data), (response) => 
        resolve(response)));

module.exports = { background, content_script, compose };