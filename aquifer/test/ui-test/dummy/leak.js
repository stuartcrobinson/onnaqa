// @ts-check
/* eslint guard-for-in: "off", no-restricted-syntax: "off", prefer-destructuring: "off" */

// leak.js and tight.js are used to demonstrate the memory leak caused by saving screenshots, and thus why --noPics has to be on for running a large number of tests

describe('DummyParent', () => {
  before(() => {
    browser.url('https://www.google.com/');
    browser.waitForExist('.RNNXgb', 20000);
  });
  it('dummyit1', () => { browser.saveScreenshot('pic'); });
  it('dummyit2', () => { browser.saveScreenshot('pic'); });
  it('dummyit3', () => { browser.saveScreenshot('pic'); });
  it('dummyit4', () => { browser.saveScreenshot('pic'); });
  it('dummyit5', () => { browser.saveScreenshot('pic'); });
  it('dummyit6', () => { browser.saveScreenshot('pic'); });
  it('dummyit7', () => { browser.saveScreenshot('pic'); });
  it('dummyit8', () => { browser.saveScreenshot('pic'); });
  it('dummyit9', () => { browser.saveScreenshot('pic'); });
  it('dummyit10', () => { browser.saveScreenshot('pic'); });
  it('dummyit11', () => { browser.saveScreenshot('pic'); });
  it('dummyit12', () => { browser.saveScreenshot('pic'); });
  it('dummyit13', () => { browser.saveScreenshot('pic'); });
  it('dummyit14', () => { browser.saveScreenshot('pic'); });
  it('dummyit15', () => { browser.saveScreenshot('pic'); });
});
