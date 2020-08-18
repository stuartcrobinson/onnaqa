// @ts-check
import { AquiferAssert, Page, key } from '../../src';

const sliderPage = new class SliderPage extends Page {
  constructor() {
    super('http://the-internet.herokuapp.com/horizontal_slider');
    this.slider = this.get('//input').tagAsLoadCriterion();
    this.readout = this.get('#range').tagAsLoadCriterion();
    super.nameElements();
  }
}();

describe('Horizontal slider', () => {
  it('testasdf', () => {
    sliderPage.load();
    sliderPage.slider.click();
    sliderPage.keys(key.LEFT, 10);
    sliderPage.keys(key.RIGHT, 5);
    sliderPage.checkVisual({ misMatchTolerance: 0.15 });
    sliderPage.checkVisual();
    AquiferAssert.valueEquals(() => sliderPage.readout.getText(), '2.5', 'slider readout');
    AquiferAssert.visualTestsPassed();
  });
});
