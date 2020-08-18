// @ts-check
import { Page } from '../../../src';


describe('DummyParent1', () => {
  describe('Dummy1', () => {
    it('go home1', () => {
      new Page('https://www.google.com')
        .load()
        .sleep(10000);
    });

    it('go home2', () => {
      // throw new Error('failing the test');
    });

    it('go home3', () => {
    });
  });
});
