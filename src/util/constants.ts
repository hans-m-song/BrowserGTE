export const SELECTORS = {
  MAIN: 'div[role=main]',
  CONVERSATIONS: 'div[aria-label=Conversations]',
  MESSAGES: 'div[aria-label=Messages]',
  SPANS:
    '[data-testid="messenger_incoming_text_row"], [data-testid="outgoing_message"]',
};

export enum Sender {
  Background = 'BACKGROUND',
  ContentScript = 'CONTENTSCRIPT',
  Options = 'OPTIONS',
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
}

export enum Header {
  OK = 'OK',
  ERROR = 'ERROR',
  RAW = 'RAW',
  PROCESSED = 'PROCESSED',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}
