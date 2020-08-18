import { OnnaPage } from '../OnnaPage';
import { modal } from '../modal/modal';

export const addSourcePage = new class AddSource extends OnnaPage {
  constructor() {
    super();
    this.addSourceSpan = this.get('//*[@onnaqaid="search-results-workspaces"]//*[text()="Add source"]').tagAsLoadCriterion();
    super.nameElements();
  }

  getSourceButton(sourceName) {
    const button = this.get(`//button//span//span[text()='${sourceName}']`);
    button.setName(`${sourceName} button`);
    return button;
  }

  openCheckTitleAndCloseButton(sourceName, modalTitle) {
    this.getSourceButton(sourceName).click_waitForChange();
    modal.assertTitle(
      modalTitle !== undefined ?
        modalTitle
        :
        `Add new ${sourceName}`
    );
    modal.close();
  }
}();
