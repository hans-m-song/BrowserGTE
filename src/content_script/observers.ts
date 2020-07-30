import {Header, SELECTORS} from '../util/constants';
import {contentScript} from '../util/message';
import {delay, waitForEl} from '../util/utils';

let messages;

interface ObserverOptions {
  target: string;
  options: MutationObserverInit;
}

abstract class Observer {
  target: string;
  options: MutationObserverInit;
  observer: MutationObserver;
  rootNode: Node;

  constructor({target, options}: ObserverOptions) {
    this.target = target;
    this.options = options;
    this.observer = new MutationObserver(this.subscriber.bind(this));
  }

  subscriber(_mutations: MutationRecord[], _observer: MutationObserver): void {}

  async observe(target?: Node) {
    if (target) {
      this.observer.observe(target, this.options);
      return Promise.resolve(this);
    }

    this.rootNode = await waitForEl(this.target);
    this.observer.observe(this.rootNode, this.options);
    return this;
  }

  disconnect() {
    this.observer.disconnect();
    return this;
  }

  async start() {
    await this.observe();
    return this;
  }

  async restart() {
    this.disconnect();
    await this.start();
    return this;
  }
}

export class MessageObserver extends Observer {
  constructor() {
    super({
      target: SELECTORS.MESSAGES,
      options: {childList: true, subtree: true},
    });
    console.log('messageobserver initialized');
  }

  async start() {
    await delay();
    await this.manual();
    await super.start();
    return this;
  }

  subscriber(mutations) {
    mutations.forEach((mutation) => {
      const node = mutation.addedNodes[0];
      if (node && node.tagName === 'DIV' && node !== this.rootNode) {
        const spans = Array.from(node.querySelectorAll(SELECTORS.SPANS));
        if (spans.length > 0) {
          this.applyToSpans(spans);
        }
      }
    });
  }

  async manual(limit = 40) {
    messages = await waitForEl(SELECTORS.MESSAGES);

    const allSpans = Array.from(messages.querySelectorAll(SELECTORS.SPANS));
    const spans = allSpans;
    // .slice(allSpans.length - limit, allSpans.length);

    await this.applyToSpans(spans);

    return this;
  }

  async applyToSpans(spans) {
    console.log('processing spans', spans);
    const spanTransformList = spans.map(async (span) => {
      await delay();
      const response = await contentScript.send(Header.RAW, span.innerHTML);
      if (response.header === Header.PROCESSED) {
        console.log('applying to span', span, response);
        span.innerHTML = response.data;
      } else {
        console.error(
          'unhandled response type',
          response.header,
          response,
          'for span',
          span,
        );
      }
    });

    await Promise.all(spanTransformList);
  }
}

export class ConversationObserver extends Observer {
  messageObserver: MessageObserver;

  constructor() {
    super({
      target: SELECTORS.CONVERSATIONS,
      options: {attributes: true, subtree: true},
    });

    this.messageObserver = new MessageObserver();
    this.messageObserver.start();
    console.log('conversationobserver initialized');
  }

  async subscriber(mutations) {
    const conversationMutations = mutations.filter(
      (mutation) => mutation.attributeName === 'tabindex',
    );

    if (conversationMutations.length > 0) {
      console.log('conversation mutation', conversationMutations);
      await this.messageObserver.restart();
    }
  }
}
