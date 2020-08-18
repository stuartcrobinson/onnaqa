import { UiElement } from '../../../../aquifer/src';

export const leftbar = new class LeftbarComp extends UiElement {
  constructor() {
    super('[onnaqaid="left-menu-sidebar"]');
    this.myOnnaLink = this.get('[onnaqaid="my-onna"]').tagAsLoadCriterion();
    this.myOnnaCaret = this.get('[onnaqaid="collapse-my-onna"]').tagAsLoadCriterion();
    this.mySourcesLink = this.get('[onnaqaid="my-sources"]').tagAsLoadCriterion();
    this.addSourceButton = this.get('[onnaqaid="add-source"]');
    this.exportsLink = this.get('[onnaqaid="exports"]');
    
    this.spacesLink = this.get('[onnaqaid="workspaces"]').tagAsLoadCriterion();
    this.addSpaceButton = this.get('[onnaqaid="add-workspace"]');
    this.spacesCaret = this.get('[onnaqaid="collapse-workspace"]');

    this.adminPanelCaret = this.get('[onnaqaid="collapse-admin"]');
    this.adminPanelCaret_expanded = this.adminPanelCaret.get('[aria-expanded="true"]');

    this.platformSettingsLink = this.get('[onnaqaid="signup-admin-preferences"]');
    this.manageMembersLink = this.get('[onnaqaid="signup-manage-members"]');
    super.nameElements();
  }
}();


/*

NEXT:

my sources page
Add Source page
exports page
spaces page
create a workspace page/pane?

workspace page/pane? compeongnt?

*/