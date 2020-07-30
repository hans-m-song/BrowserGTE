import {Header, LogLevel, Sender} from './constants';

interface Message {
  header: Header;
  sender: Sender;
  data: unknown;
  level: LogLevel;
}

const compose = (
  header: Header,
  sender: Sender,
  data: unknown,
  level = LogLevel.LOG,
): Message => ({
  header,
  level,
  sender,
  data,
});

interface Communication {
  send: (header: Header, data?: unknown, level?: LogLevel) => Promise<Message>;
  compose: (header: Header, data?: unknown, level?: LogLevel) => Message;
}

export const background: Communication = {
  send: (header, data, level) =>
    new Promise((resolve) =>
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>
        chrome.tabs.sendMessage(
          tabs[0].id,
          compose(header, Sender.Background, data, level),
          (response) => resolve(response),
        ),
      ),
    ),
  compose: (header, data, level) =>
    compose(header, Sender.Background, data, level),
};

export const contentScript: Communication = {
  send: (header: Header, data: unknown, level: LogLevel) =>
    new Promise((resolve) =>
      chrome.runtime.sendMessage(
        compose(header, Sender.ContentScript, data, level),
        (response) => resolve(response),
      ),
    ),
  compose: (header: Header, data: unknown, level: LogLevel) =>
    compose(header, Sender.ContentScript, data, level),
};
