// @ts-check

import { AquiferAssert } from '../../../src';
import { fastWebpage } from '../../ui-model/misc/fastWebpage.page';
/* eslint guard-for-in: "off", no-restricted-syntax: "off", prefer-destructuring: "off" */

describe('Confirm: random synonym', () => {
  // this.retries(2);

  before(() => {
    fastWebpage.load();
  });
  it('it1', () => {
    fastWebpage.feedTheBotImage.hover({ timeout: 2000 });
    // fastWebpage.nonexistentElement.hover{ timeout: 2000 });
    fastWebpage.checkVisual();
    AquiferAssert.visualTestsPassed();


    // fastWebpage.checkVisual();
    // AquiferAssert.visualTestsPassed();
  });
});
