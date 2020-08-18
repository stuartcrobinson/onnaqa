import { UiElement, AquiferAssert } from "../../../../aquifer/src";

export const modal = new class Modal extends UiElement {
  constructor() {
    super("//dialog[@role='dialog']");
    this.closeButton = this.get("//pa-button[@icon='clear']").tagAsLoadCriterion();
    this.titleElement = this.get("//pa-dialog-title").tagAsLoadCriterion();
    super.nameElements();
  }

  close() {
    this.closeButton.click_waitForNotExisting();
  }

  assertTitle(expectedTitle) {
    const actualTitle = this.titleElement.getText();
    // AquiferAssert.assert(expectedTitle === actualTitle, `expected title: ${expectedTitle}. actual title: ${actualTitle}`);
    AquiferAssert.valueEquals(() => modal.titleElement.getText(), expectedTitle, "modal title")
  }
}();

