// @ts-check
import { A_VISUAL_TEST_FAILED, log } from './AquiferLog';

const timeoutWdio = require('../wdio-conf/wdio.conf').config.waitforTimeout;

export class AquiferAssert {
  static visualTestsPassed() {
    if (log.aVisualTestFailed) {
      log.aVisualTestFailed = false;
      throw new Error(A_VISUAL_TEST_FAILED);
    }
  }

  static valueEquals(f, value, targetDescription, timeout = timeoutWdio) {
    const screenshotId = log.logRichMessages([
      { text: '🤔  ', style: log.style.emoji },
      { text: 'Assert ', style: log.style.verb },
      { text: `${targetDescription} `, style: log.style.object },
      { text: 'equals ', style: log.style.verb },
      { text: value, style: log.style.object }]);
    try {
      browser.waitUntil(() => f() === value, Math.round(timeout / 2));
    } catch (err) {
      log.saveScreenshotWhileWaiting();
    }
    try {
      browser.waitUntil(() => f() === value, timeout);
    } catch (err) {
      throw new Error(`${targetDescription}: Expected:  "${value}". Actual: "${f()}"`);
    } finally {
      log.saveEventScreenshot(screenshotId);
    }
  }

  static assert(boolean, description) {
    const screenshotId = log.logRichMessages([
      { text: '🤔  ', style: log.style.emoji },
      { text: 'Assert true: ', style: log.style.verb },
      { text: `${description}. `, style: log.style.object },
      { text: 'Actual: ', style: log.style.filler },
      { text: JSON.stringify(boolean), style: log.style.object }]);
    log.saveEventScreenshot(screenshotId);

    if (!boolean) {
      throw new Error(`Assertion failed. ${description}`);
    }
  }
}
