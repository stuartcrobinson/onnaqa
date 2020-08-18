// @ts-check
import { Page } from '../../../src';

// import { AquiferAssert } from '../../../src';

// https://stackoverflow.com/questions/36319904/es6-classes-with-parent-in-different-file-and-node-js

export const fastWebpage = new class FastWebpage extends Page {
  constructor() {
    super('https://varvy.com/pagespeed/wicked-fast.html');
    this.feedTheBotImage = this.get('.head a').tagAsLoadCriterion();
    this.nonexistentElement = this.get('.awefiwefisjdlfis');
    this.h2 = this.get('//h2[text()="Gaze at my beauty, humans, but gaze not long"]').tagAsLoadCriterion();
    super.nameElements();
  }
}();
