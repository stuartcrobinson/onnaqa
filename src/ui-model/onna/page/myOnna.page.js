import { OnnaPage } from '../OnnaPage';

export const myOnnaPage = new class MyOnna extends OnnaPage {
  constructor() {
    super();
    this.myOnnaSpan = this.get('//*[@onnaqaid="search-results-workspaces"]//*[text()="My Onna"]').tagAsLoadCriterion();
    super.nameElements();
  }
}();
