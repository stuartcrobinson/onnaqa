// @ts-check
import { log } from './AquiferLog';

const timeoutWdio = require('../wdio-conf/wdio.conf').config.waitforTimeout;

/**
 * Any class that contains custom web element objects.
 *
 * Abstract class
 */
/* eslint guard-for-in: "off", no-restricted-syntax: "off",  */
export class UiContainer {
  constructor() {
    if (this.constructor === UiContainer) {
      throw new TypeError('Abstract class cannot be instantiated directly.');
    }
    this.selector = undefined;
  }

  /* eslint guard-for-in: "off", no-restricted-syntax: "off" */
  /**
   * This adds a custom name parameter to each element object so that the variable's name
   * can be displayed in the ui test logs instead of just a potentially cryptic selector.
   *
   * This was inspired by the idea that maybe we should avoid using visible values in selectors to prepare for multi-language support
   */
  nameElements() {
    for (const propName in this) {
      const propValue = this[propName];
      if (propValue) {
        try {
          // @ts-ignore
          propValue.setName(propName);
        } catch (err) {
          // do nothing. love to check if propValue was instanceOf UiElement but that requires circular dependency
        }
      }
    }
  }

  setName(name) {
    this.elementName = name;
    return this;
  }

  /** Name of the element as will be displayed in output logs. */
  get name() { return this.elementName; }

  /** Returns an array of page criteria: UiElements that must be found to indicate a page has successfully loaded. */
  get criteriaElements() {
    const abElements = [];

    for (const propName in this) {
      const propValue = this[propName];
      try {
        // @ts-ignore
        if (propValue.isLoadCriterion) { // propValue instanceof UiElement &&
          abElements.push(propValue);
        }
      } catch (err) {
        // do nothing.  i would love to check if propValue was instanceOf UiElement but that gives circular dependency errors
      }
    }
    return abElements;
  }

  waitForLoad(timeout = timeoutWdio) {
    try {
      for (let i = 0; i < this.criteriaElements.length; i++) {
        const element = this.criteriaElements[i];
        // @ts-ignore
        element.waitForExist(timeout);
      }
    } catch (error) {
      throw new Error(`An element in ${this.constructor.name} failed to load within ${timeout} ms. ${error}`);
    }
    return this;
  }

  /** timeout < 0 to use default in wdio conf */
  waitFor(timeout = timeoutWdio, doLog = false) {
    if (timeout === null || timeout === undefined) {
      timeout = timeoutWdio;
    }
    if (timeout < 0) {
      // eslint-disable-next-line no-param-reassign
      timeout = timeoutWdio;
    }
    if (doLog) {
      this.logImmediately([
        { text: '⏳  ', style: log.style.emoji },
        { text: 'Wait for ', style: log.style.verb },
        { text: this.elementName, style: log.style.object },
        // { text: ' to exist', style: log.style.filler }
        { text: this.selector, style: log.style.selector }])
    }
    // @ts-ignore
    if (this.waitForExist) {
      // @ts-ignore
      this.waitForExist(timeout);
    }
    return this.waitForLoad(timeout);
  }


  /** no hover */
  logImmediately(messages) {
    if (!this.name) {
      throw new Error(`Found ${this.constructor.name} with no name.  Make sure that the constructor for each class extending UiContainer ends with super.nameElements(). selector: ${this.selector}`);
    }
    const screenshotId = log.logRichMessages(messages);

    log.saveEventScreenshot(screenshotId);
  }


  isLoaded(timeout = timeoutWdio) {
    for (let i = 0; i < this.criteriaElements.length; i++) {
      const element = this.criteriaElements[i];
      // @ts-ignore
      element.getWebElement(timeout);
    }
    return true;
  }

  /* eslint class-methods-use-this: "off" */
  findWebElements(selector) {
    return $$(selector);
  }

  /* eslint class-methods-use-this: "off" */
  findWebElement(selector) {
    return $(selector);
  }

  /**
   * Asserts that the browser screen matches the screenshot saved in screenshots/reference.
   *
   * To reset the reference image, replace `checkVisual(...)` with `resetVisual(...)` and re-run.
   * @param  excludedElements UiElement - cssSelectors or xpaths for sections of the screen to ignore
   */
  checkVisual({ excludedElements = [], misMatchTolerance = 0.05 } = { excludedElements: [], misMatchTolerance: 0.05 }) {
    if (global.aquiferOptions.doVisualTests) { // must be manually turned on with this command line parameter cos so flaky
      if (global.aquiferOptions.resetReferenceImages) {
        global.doDeleteReferenceImage = true;
      }

      this.waitFor();
      excludedElements.forEach((uiElement) => {
        uiElement.waitForVisible();
      });

      const excludedSelectors = excludedElements.map(uiElement => uiElement.selector);

      log.screenshotTargetName = this.name;
      log.screenshotTargetSelector = excludedSelectors.length > 0 ? ` excluding: ${JSON.stringify(excludedSelectors)}` : '';

      let succeeded = false;

      let report;

      const initTime = new Date().getTime();

      let count = 0;

      while (!succeeded && new Date().getTime() - initTime < timeoutWdio) {
        global.doLogVisualTest = count === 0;
        if (this.selector) {
          /* is an element */
          global.customScreenshotTag = global.filenamify(this.selector);

          /* eslint prefer-destructuring: "off" */
          // @ts-ignore
          report = browser.checkElement(this.selector, { hide: excludedSelectors, misMatchTolerance })[0];
        } else {
          /* is a page */

          global.customScreenshotTag = global.filenamify(`${this.constructor.name}Page`);

          /* eslint prefer-destructuring: "off" */
          // @ts-ignore
          report = browser.checkDocument({ hide: excludedSelectors, misMatchTolerance })[0];
        }
        succeeded = report.isWithinMisMatchTolerance;
        if (!succeeded) {
          this.sleep(2000);
        }
        count += 1;
      }

      if (!report.isWithinMisMatchTolerance) {
        log.logFailedVisualTest(global.previousImageFileLocation, report);
        log.aVisualTestFailed = true;
      }
      global.customScreenshotTag = undefined;
      log.screenshotTargetName = undefined;
      log.screenshotTargetSelector = undefined;
    }
  }

  resetVisual({ excludedElements = [], misMatchTolerance }) {
    // this is sloppy but i'm not sure how else to determine the ref image name - stuart 11/22/2018
    global.doDeleteReferenceImage = true;
    this.checkVisual({ excludedElements, misMatchTolerance });
    global.doDeleteReferenceImage = false;
  }

  /**
   * if input is a single array, the elements will be typed consecutively.
   *
   * if input is a list of values, the first value is a key to type (k), and the next value is how many times to type it (n), as in
   *
   * keys(k1, n1, k2, n2)
   *
   * if the last "n" value is missing, it's assumed to be 1.
   *
   * if last element is "false", then each key won't be logged
   * @param  {...any} inputs
   */
  keys(...inputs) {
    try {
      this.waitFor();
    } catch { /* do nothing */ } finally { /* do nothing */ }

    const inputObjects = [];

    let doLog = true;

    let outputString = '';

    if (inputs.length === 1) {
      inputObjects.push({ k: inputs[0], n: 1 });
      outputString = JSON.stringify(inputObjects[0].k);
    } else {
      for (let i = 0; i < inputs.length; i += 2) {
        const k = inputs[i];

        if (i + 1 < inputs.length) {
          const n = inputs[i + 1];

          inputObjects.push({ k, n });
          outputString += `${JSON.stringify(k) + (n > 1 ? `x${n}` : '')}, `;
        } else {
          doLog = k;
        }
      }
      outputString = outputString.slice(0, -2);
    }

    if (doLog) {
      log.logRichMessagesWithScreenshot([
        { text: '⌨  ', style: log.style.emoji },
        { text: 'Type ', style: log.style.verb },
        { text: outputString, style: log.style.object }]);
    }

    this.waitFor();
    // @ts-ignore
    this.click && this.click({ doLogAndWait: false });

    for (let i = 0; i < inputObjects.length; i++) {
      const inputObject = inputObjects[i];
      for (let j = 0; j < inputObject.n; j++) {
        browser.keys(inputObject.k);
      }
    }
  }

  sleep(timeout = timeoutWdio) {
    this.waitForLoad(timeout);
    browser.pause(timeout);
  }
}
