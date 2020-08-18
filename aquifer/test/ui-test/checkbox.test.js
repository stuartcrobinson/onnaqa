// @ts-check

import { AquiferAssert, Page } from '../../src';
// import {AquiferAssert, Page} from "../../lib";


const checkboxesPage = new class CheckboxesPage extends Page {
  constructor() {
    super('http://the-internet.herokuapp.com/checkboxes');
    this.checkbox1 = this.get('//input[1]').tagAsLoadCriterion();
    this.checkbox2 = this.get('//input[2]').tagAsLoadCriterion();
    super.nameElements();
  }
}();

// this doesn't work.  needs javascript injection into page
// http://elementalselenium.com/tips/39-drag-and-drop

describe('Checkbox', () => {
  it('test', () => {
    checkboxesPage.load();
    console.log(checkboxesPage.checkbox1.getWebElement().getAttribute('checked'));
    console.log(checkboxesPage.checkbox2.getWebElement().getAttribute('checked'));
    AquiferAssert.valueEquals(() => checkboxesPage.checkbox2.getWebElement().getAttribute('checked'), 'true', 'checkbox1 checked?');
    AquiferAssert.assert(!checkboxesPage.checkbox1.getWebElement().getHTML().includes('checked'), 'checkbox1 not checked');

    checkboxesPage.checkbox1.click_waitForChange();
    checkboxesPage.checkbox2.click_waitForChange();

    AquiferAssert.valueEquals(() => checkboxesPage.checkbox1.getWebElement().getAttribute('checked'), 'true', 'checkbox1 checked?');
    AquiferAssert.assert(!checkboxesPage.checkbox2.getWebElement().getHTML().includes('checked'), 'checkbox2 not checked');
  });
});
