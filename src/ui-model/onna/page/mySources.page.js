import { OnnaPage } from '../OnnaPage';

export const mySourcesPage = new class MySources extends OnnaPage {
  constructor() {
    super();
    this.mySourcesSpan = this.get('//*[@onnaqaid="search-results-workspaces"]//*[text()="My sources"]').tagAsLoadCriterion();
    super.nameElements();
  }
}();
