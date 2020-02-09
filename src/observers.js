const { waitForEl, delay } = require('./utils');
const { send } = require('./message').content_script;
const { MESSAGETYPES, SELECTORS } = require('./constants');

let messages;

class Observer {
    constructor(config) {
        this.target = config.target;
        this.options = config.options;
        this.observer = new MutationObserver(this.subscriber.bind(this));
    }

    async observe(target) {
        if (target) {
            this.observer.observe(target, this.options);
            return Promise.resolve(this);
        }

        const element = await waitForEl(this.target);
        this.observer.observe(element, this.options);
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

class MessageObserver extends Observer {

    constructor() {
        super({
            target: SELECTORS.MESSAGES,
            options: { childList: true, subtree: true }
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
            if (mutation.addedNodes.length > 0
                && mutation.removedNodes.length === 0
                && mutation.target.tagName === 'DIV'
                && mutation.addedNodes[0].tagName === 'DIV'
            ) {
                const spans = Array.from(mutation.addedNodes[0].querySelectorAll(SELECTORS.SPANS));
                if (spans.length > 0) {
                    this.applyToSpans(spans);
                }
            }
        });
    }

    async manual(limit = 40) {
        messages = await waitForEl(SELECTORS.MESSAGES);

        const allSpans = Array.from(messages.querySelectorAll(SELECTORS.SPANS));
        const spans = allSpans
            // .slice(allSpans.length - limit, allSpans.length);

        await this.applyToSpans(spans);

        return this;
    }

    async applyToSpans(spans) {
        console.log('processing spans', spans);
        const spanTransformList = spans.map(async span => {
            await delay();
            const response = await send(MESSAGETYPES.MESSAGE.RAW, span.innerHTML);
            if (response.header === MESSAGETYPES.MESSAGE.PROCESSED) {
                console.log('applying to span', span, response);
                span.innerHTML = response.data;
            } else {
                console.error('unhandled response type', response.header, response, 'for span', span);
            }
        });

        await Promise.all(spanTransformList);
    }

}

class ConversationObserver extends Observer {

    constructor() {
        super({
            target: SELECTORS.CONVERSATIONS,
            options: { attributes: true, subtree: true }
        });

        this.messageObserver = new MessageObserver();
        this.messageObserver.start();
        console.log('conversationobserver initialized');
    }

    async subscriber(mutations) {
        const conversationMutations = mutations
            .filter(mutation => mutation.attributeName === 'tabindex');

        if (conversationMutations.length > 0) {
            console.log('conversation mutation', conversationMutations);
            await this.messageObserver.restart();
        }
    }

}

module.exports = {
    ConversationObserver,
    MessageObserver,
}