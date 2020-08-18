import { Page } from '../../../aquifer/src';

/** Abstract class */
export class OnnaPage extends Page {
  /** @param {string} urlPath   */
  constructor(urlPath = undefined) {
    super(global.aquiferOptions.onnaUrl, urlPath);
    if (this.constructor === OnnaPage) {
      throw new TypeError('Abstract class cannot be instantiated directly.');
    }
    // this.toast_accessDenied = toast.withMessage('You do not have access to this page.');
  }

  // getToast(message) {
  //   return toast.withMessage(message);
  // }
}
