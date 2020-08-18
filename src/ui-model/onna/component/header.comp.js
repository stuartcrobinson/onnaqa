import { UiElement } from '../../../../aquifer/src';

export const header = new class HeaderComp extends UiElement {
  constructor() {
    super('[onnaqaid="dashboard-header"]');
    this.leftbarToggleButton = this.get('[onnaqaid="main-menu-button"]').tagAsLoadCriterion();
    this.rightbarToggleButton = this.get('[onnaqaid="o-main-toolbar-right_profile"]').tagAsLoadCriterion();
    super.nameElements();
  }
}();
