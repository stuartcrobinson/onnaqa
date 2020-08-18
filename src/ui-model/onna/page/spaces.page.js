import { OnnaPage } from '../OnnaPage';

export const spacesPage = new class Spaces extends OnnaPage {
  constructor() {
    super();
    this.spacesSpan = this.get('//*[@onnaqaid="search-results-workspaces"]//*[text()="Spaces"]').tagAsLoadCriterion();
    super.nameElements();
  }
}();
