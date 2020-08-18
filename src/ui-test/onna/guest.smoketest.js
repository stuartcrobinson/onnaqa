import { header } from '../../ui-model/onna/component/header.comp'
import { loginPage } from '../../ui-model/onna/page/login.page';
import { leftbar } from '../../ui-model/onna/component/leftbar.comp';
import { myOnnaPage } from '../../ui-model/onna/page/myOnna.page';
import { mySourcesPage } from '../../ui-model/onna/page/mySources.page';
import { spacesPage } from '../../ui-model/onna/page/spaces.page';

describe('guest sanity check', () => {
  before(() => {
    loginPage.attemptLogIn({ email: global.aquiferOptions.onnaProdEmail_guest, password: global.aquiferOptions.onnaProdPassword_guest });
    header.leftbarToggleButton.click_waitForChange(); //assumes leftbar starts closed
  });

  it('leftbar links', () => {
    leftbar.myOnnaLink.click_waitForChange();
    myOnnaPage.waitFor(null, true);

    leftbar.mySourcesLink.click_waitForChange();
    mySourcesPage.waitFor(null, true);

    leftbar.spacesLink.click_waitForChange();
    spacesPage.waitFor(null, true);
  });

  it('cant access protected leftbar stuff', () => {
    leftbar.addSourceButton.assertNotExists();
    leftbar.exportsLink.assertNotExists();
    leftbar.addSpaceButton.assertNotExists();
    leftbar.adminPanelCaret.assertNotExists();
  });
});
