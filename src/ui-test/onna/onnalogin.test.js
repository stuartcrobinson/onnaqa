import { header } from '../../ui-model/onna/component/header.comp'
import { rightbar } from '../../ui-model/onna/component/rightbar.comp'
import { loginPage } from '../../ui-model/onna/page/login.page';

describe('Login', () => {
  it('with invalid creds', () => {
    loginPage.attemptLogIn({ email: global.aquiferOptions.onnaEmail + ' invalid creds!!!!', password: `${global.aquiferOptions.onnaPassword}invalidBit` });
    loginPage.msg_badCreds.waitForExist();
  });

  describe('with valid creds', () => {
    it('open Settings menu', () => {
      loginPage.logIn();
    });

    it('click Sign Out', () => {
      header.rightbarToggleButton
        .waitFor()
        .click_waitForChange();
      rightbar.logoutButton.click_waitForNotExisting();
      loginPage.waitForLoad();
    });
  });
});
