import { UiElement } from '../../../../aquifer/src';

export const rightbar = new class RightbarComp extends UiElement {
  constructor() {
    super(".o-user-panel"); //not really useful
    this.logoutButton = this.get('[onnaqaid="profile-links-logout"]').tagAsLoadCriterion();
    super.nameElements();
  }
}();
