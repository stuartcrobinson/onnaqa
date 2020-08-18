import { OnnaPage } from '../OnnaPage';

export const exportsPage = new class Exports extends OnnaPage {
  constructor() {
    super();
    this.exportsSpan = this.get('//*[@onnaqaid="search-results-workspaces"]//*[text()="Exports"]').tagAsLoadCriterion();
    super.nameElements();
  }
}();
