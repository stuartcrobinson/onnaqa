
// eslint-disable-next-line import/no-cycle
import { loginPage } from '../page/login.page';
import { UiElement } from '../../../../../aquifer/src';

class SettingsDropdownComp extends UiElement {
  constructor() {
    super('//div[contains(@class, "ws-sidebar__account-menu--open")]');
    this.accountLink = this.get("//*[*='account_circle']");
    this.billingLink = this.get("//*[*='credit_card']");
    this.teamLink = this.get("//*[*='group']");
    this.legalLink = this.get("//*[*='gavel']");
    this.customerAdminLink = this.get("//*[*='lock_outline']");
    this.signOutLink = this.get("//*[*='exit_to_app']");
    this.greetingSpan = this.get("//*[contains(@class, 'account_menu__greeting')]");
    super.nameElements();
  }
}

export const sidebar = new class SideBarComp extends UiElement {
  constructor() {
    super('//div[@class="ws-sidebar"]');

    this.dashboardLink = this.get("//*[*='web']");
    this.galleryLink = this.get("//*[*='view_module']");
    this.integrationsLink = this.get("//*[*='device_hub']");
    this.apiAccessLink = this.get("//*[*='code']");
    this.helpLink = this.get("//*[*='help']");
    this.liveChatLink = this.get("//*[*='chat']");
    this.settingsLink = this.get("//*[*='settings']");

    this.dataLink = this.get("//*[*='grid_on']");
    this.writeLink = this.get("//*[*='mode_edit']");
    this.calculateLink = this.get("//*[@*='calcs-link']");

    /** only in Editor sidebar.  clean up sidebars organization? */
    this.reviewLink = this.get("//*[*='done']");
    this.downloadLink = this.get("//*[*='file_download']");

    this.settingsMenu = new SettingsDropdownComp();
    super.nameElements();
  }

  signOut() {
    this.settingsLink.hover();
    this.settingsMenu.signOutLink.click();
    loginPage.toast_signedOutSuccessfully.close();
  }
}();
