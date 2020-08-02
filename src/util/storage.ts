type StorageType = 'sync' | 'local';

export const storage = (type: StorageType = 'sync') => {
  const set = (data: Object): Promise<void> =>
    new Promise((resolve, reject) =>
      chrome.storage[type].set(data, () =>
        chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(),
      ),
    );

  const get = (
    data: string | string[] | Object,
  ): Promise<{[key: string]: any}> =>
    new Promise((resolve, reject) =>
      chrome.storage[type].get(data, (result: {[key: string]: any}) =>
        chrome.runtime.lastError
          ? reject(chrome.runtime.lastError)
          : resolve(result),
      ),
    );

  const list = (): Promise<{[key: string]: any}> =>
    new Promise((resolve, reject) =>
      chrome.storage[type].get(null, (result: {[key: string]: any}) =>
        chrome.runtime.lastError
          ? reject(chrome.runtime.lastError)
          : resolve(result),
      ),
    );

  const remove = (keys: string | string[]): Promise<{[key: string]: any}> =>
    new Promise((resolve, reject) =>
      chrome.storage[type].remove(keys, () =>
        chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(),
      ),
    );
  const clear = (): Promise<{[key: string]: any}> =>
    new Promise((resolve, reject) =>
      chrome.storage[type].clear(() =>
        chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(),
      ),
    );

  return {
    set,
    get,
    list,
    remove,
    clear,
  };
};
