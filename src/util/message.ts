import {Header, LogLevel, Sender} from './constants';

export interface Message {
  header: Header;
  sender: Sender;
  data: unknown;
  level: LogLevel;
}

const composeMessage = (
  header: Header,
  sender: Sender,
  data: Message['data'],
  level = LogLevel.LOG,
): Message => ({
  header,
  level,
  sender,
  data,
});

interface Communication {
  send: (
    header: Header,
    data?: Message['data'],
    level?: LogLevel,
  ) => Promise<Message>;
  compose: (
    header: Header,
    data?: Message['data'],
    level?: LogLevel,
  ) => Message;
}

export const message = (sender: Sender) => {
  const compose: Communication['compose'] = (header, data, level) =>
    composeMessage(header, sender, data, level);

  const toContentScript: Communication['send'] = (header, data, level) => {
    const message = composeMessage(header, sender, data, level);
    return new Promise((resolve) =>
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>
        chrome.tabs.sendMessage(tabs[0].id!, message, (response) =>
          resolve(response),
        ),
      ),
    );
  };

  const toExtension: Communication['send'] = (header, data, level) => {
    const message = composeMessage(header, sender, data, level);
    return new Promise((resolve) =>
      chrome.runtime.sendMessage(message, (response) => resolve(response)),
    );
  };

  return {
    compose,
    send: {toContentScript, toExtension},
  };
};

export const logMessage = (message: Message, preamble?: string) => {
  const {sender, header, data} = message;
  const parts = [sender, header, data];
  if (preamble) {
    parts.unshift(preamble);
  }
  console[message.level](...parts);
};
