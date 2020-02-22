const createStoragePromise = (type = 'sync') =>
    (func, data) => {
        return new Promise((resolve, reject) =>
            chrome.storage[type][func](data, (result) => chrome.runtime.lastError
                ? reject(chrome.runtime.lastError)
                : resolve(result)));
    };

const storage = (type = 'local') => {
    const promisify = createStoragePromise(type);
    return {
        set: (data) => promisify('set', data),
        get: (key) => promisify('get', key),
        list: () => promisify('get', null),
        remove: (key) => promisify('remove', key),
        clear: () => promisify('clear'),
    };
};

module.exports = {
    storage,
}