import {Header, LogLevel, Sender} from './constants';

export interface Message {
  header: Header;
  sender: Sender;
  data: unknown;
  level: LogLevel;
}
export interface ParseMessage extends Message {
  header: Header.PROCESSED | Header.RAW;
  data: string;
}

export interface ComMessage extends Message {
  header: Header.ACK | Header.NACK;
  data: string;
}

export interface OptMessage extends Message {
  header: Header.IMPORT | Header.EXPORT;
  data: {};
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

export const message = (sender: Sender): Communication => {
  const compose: Communication['compose'] = (header, data, level) =>
    composeMessage(header, sender, data || '', level);

  const sendFromExtension: Communication['send'] = (header, data, level) =>
    new Promise((resolve) =>
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>
        chrome.tabs.sendMessage(
          tabs[0].id!,
          composeMessage(header, sender, data || '', level),
          (response) => resolve(response),
        ),
      ),
    );

  const sendFromContentScript: Communication['send'] = (header, data, level) =>
    new Promise((resolve) =>
      chrome.runtime.sendMessage(
        composeMessage(header, Sender.ContentScript, data || '', level),
        (response) => resolve(response),
      ),
    );

  const send =
    sender === Sender.Background || sender === Sender.Options
      ? sendFromExtension
      : sendFromContentScript;

  return {compose, send};
};
