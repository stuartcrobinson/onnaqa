import { header } from '../../ui-model/onna/component/header.comp'
import { loginPage } from '../../ui-model/onna/page/login.page';
import { leftbar } from '../../ui-model/onna/component/leftbar.comp';
import { myOnnaPage } from '../../ui-model/onna/page/myOnna.page';
import { mySourcesPage } from '../../ui-model/onna/page/mySources.page';
import { exportsPage } from '../../ui-model/onna/page/exports.page';
import { spacesPage } from '../../ui-model/onna/page/spaces.page';
import { modal } from '../../ui-model/onna/modal/modal';
import { addSourcePage } from '../../ui-model/onna/page/addSource.page';

describe('admin sanity check', () => {
  before(() => {
    loginPage.attemptLogIn({ email: global.aquiferOptions.onnaProdEmail_admin, password: global.aquiferOptions.onnaProdPassword_admin });
    header.leftbarToggleButton.click_waitForChange(); //assumes leftbar starts closed
  });

  it('leftbar links', () => {
    leftbar.myOnnaLink.click_waitForChange();
    myOnnaPage.waitFor(null, true);

    leftbar.mySourcesLink.click_waitForChange();
    mySourcesPage.waitFor(null, true);

    leftbar.exportsLink.click_waitForChange();
    exportsPage.waitFor(null, true);

    leftbar.spacesLink.click_waitForChange();
    spacesPage.waitFor(null, true);

    if (!leftbar.adminPanelCaret_expanded.isExisting()) {
      leftbar.adminPanelCaret.click_waitForExisting(leftbar.adminPanelCaret_expanded.selector);
    }

    leftbar.platformSettingsLink.click_waitForChange();
    modal.waitFor();
    modal.assertTitle("Admin preferences");
    modal.close();

    leftbar.manageMembersLink.click_waitForChange();
    modal.waitFor();
    modal.assertTitle("Invite and add users");
    modal.close();

  });


  it('new source buttons', () => {
    leftbar.addSourceButton.click_waitForChange();
    addSourcePage.waitFor();

    addSourcePage.openCheckTitleAndCloseButton("Confluence");
    addSourcePage.openCheckTitleAndCloseButton("Folder");
    addSourcePage.openCheckTitleAndCloseButton("Gmail");
    addSourcePage.openCheckTitleAndCloseButton("Jira");
    addSourcePage.openCheckTitleAndCloseButton("Microsoft Outlook");
    addSourcePage.openCheckTitleAndCloseButton("Quip");
    addSourcePage.openCheckTitleAndCloseButton("Slack");
    addSourcePage.openCheckTitleAndCloseButton("Slack Enterprise");
    addSourcePage.openCheckTitleAndCloseButton("Zendesk", "Add new Zendesk source");

  });
});
