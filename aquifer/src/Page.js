// @ts-check
import { UiContainer } from './UiContainer';
import { UiElement } from './UiElement';
import { log } from './AquiferLog';
import { AquiferFunctionalPersister } from './AquiferFunctionalPersister';

const timeoutWdio = require('../wdio-conf/wdio.conf').config.waitforTimeout;

/** Parent class for specific page objects. */
export class Page extends UiContainer {
  constructor(baseUrl, urlPath = undefined) {
    if (baseUrl.slice(-1) === '/') {
      throw Error("baseUrl shouldn't end with a forward slash (/)");
    }
    if (urlPath && !urlPath.startsWith('/')) {
      throw new Error('urlPath should start with forward slash (/)');
    }
    super();
    this.url = baseUrl + (urlPath || '');
    super.setName(this.constructor.name);
  }

  setUrl(url) {
    this.url = url;
    return this;
  }

  static load(url) {
    log.logRichMessagesWithScreenshot([
      { text: '🕸  ', style: log.style.emoji },
      { text: 'Load ', style: log.style.verb },
      { text: url, style: log.style.selector }]);

    browser.url(url);
  }

  attemptToNavigateTo() {
    log.logRichMessagesWithScreenshot([
      { text: '🤞  ', style: log.style.emoji },
      { text: 'Attempt to navigate to ', style: log.style.verb },
      { text: `${this.name} Page `, style: log.style.object },
      { text: this.url, style: log.style.selector }]);

    browser.url(this.url);
  }

load(timeout = timeoutWdio) {
    log.logRichMessagesWithScreenshot([
      { text: '🕸  ', style: log.style.emoji },
      { text: 'Load ', style: log.style.verb },
      { text: `${this.name} Page `, style: log.style.object },
      { text: this.url, style: log.style.selector }]);

    browser.url(this.url);
    return super.waitForLoad(timeout);
  }

  load_waitForChange(indicatorSelector = '//body', timeout = timeoutWdio) {
    const indicatorElement = new UiElement(indicatorSelector);

    if (indicatorElement.isExisting()) {
      const initialIndicatorElementHtml = indicatorElement.getHtml();


      log.logRichMessagesWithScreenshot([
        { text: '🕸  ', style: log.style.emoji },
        { text: 'Load ', style: log.style.verb },
        { text: `${this.name} Page `, style: log.style.object },
        { text: this.url, style: log.style.selector },
        { text: ' then wait for change in ', style: log.style.filler },
        { text: indicatorSelector, style: log.style.selector },
        { text: ' target: ', style: log.style.filler },
        { text: `${indicatorSelector} `, style: log.style.selector }]);

      browser.url(this.url);

      new AquiferFunctionalPersister(timeout)
        .setGoal(() => indicatorElement.getHtml() !== initialIndicatorElementHtml)
        .failFastWithMessage(`timeout waiting for ${indicatorSelector} to change after loading ${this.name}`)
        .start();
      return super.waitForLoad(timeout);
    }

    return this.load(timeout);
  }


  loadWithRetry(timeoutInMillis = timeoutWdio * 5) {
    let succeeded = false;

    const initTime = new Date().getTime();

    while (!succeeded && new Date().getTime() - initTime < timeoutInMillis) {
      try {
        this.load();
        succeeded = true;
      } catch (err) { /* do nothing */ }
    }
  }

  /* eslint class-methods-use-this: "off" */
  get(selector) {
    return new UiElement(selector);
  }

  getTextElement(text, tag = '*') {
    const element = this.get(`//${tag}[contains(text(), '${text}')]`);
    element.setName(`${tag}["${text}"]`);
    return element;
  }

  waitForTextNotExist(text) {
    this.getTextElement(text).waitForNotExist();
  }
}
