import { OnnaPage } from '../OnnaPage';
// eslint-disable-next-line import/no-cycle
import { header } from '../component/header.comp';


export const loginPage = new class Login extends OnnaPage {
  constructor() {
    super();
    this.emailInput = this.get('input#username-input').tagAsLoadCriterion();
    this.passwordInput = this.get('input#userpass-input').tagAsLoadCriterion();
    this.logInButton = this.get('button[aria-label="Log in"]').tagAsLoadCriterion();
    this.msg_badCreds = this.get("//*[text()='Incorrect username or password']");
    super.nameElements();
  }

  attemptLogIn({ email, password, failsafe = false }) {
    try {
      this.load();
      this.emailInput.setValue(email);
      this.passwordInput.setValue(password, { doMaskTextInLogs: global.aquiferOptions.hidePassword });
      this.logInButton.click();
    } catch (err) {
      if (!failsafe || !header.isLoaded()) {
        throw err;
      }
    }
  }

  /**
   * Logs in and waits for Dashboard page to load.
   * @param {Object} obj - an object
   * @param {Boolean} obj.failsafe - no error thrown if already logged in
   */
  logIn({ failsafe } = { failsafe: false }) {
    this.attemptLogIn({ email: global.aquiferOptions.onnaEmail, password: global.aquiferOptions.onnaPassword, failsafe });
    header.waitForLoad();
  }
}();
