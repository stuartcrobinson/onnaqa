import dateFormat from 'dateformat';
import { log, Page } from '../../aquifer/src';
import { getNewestEmail1 } from '../../aquifer/src/AquiferEmailChecker';
import { accountInvitationPage } from './ui-model/wordsmith/misc/page/invitation.page';
// import { dashboardPage } from './ui-model/wordsmith/misc/page/dashboard.page';
import { termsOfUsePage } from './ui-model/wordsmith/misc/page/termsOfUse.page';

export function makeSlugSafeName(x) {
  let slugSafe = x;
  slugSafe = slugSafe.replace(/[^\w-]/g, ' ');
  slugSafe = slugSafe.replace(/\s\s+/g, ' ');
  slugSafe = slugSafe.replace(/ /g, '-');
  slugSafe = slugSafe.toLowerCase();
  return slugSafe;
}

export function newProjectName(label = undefined) {
  return this.makeSlugSafeName(`${log.specDate} ${dateFormat(new Date(), 'hh:MM:ss.lTT').toLowerCase()}${label ? ` ${label}` : ''}`);
}

export function getProjectUrlFromName(name) {
  return `${global.aquiferOptions.wsUrl}/projects/${name}`;
}

export function getDefaultEditorUrlFromProjName(proj) {
  // https://ue1.autoi.co/projects/project-3/templates/project-3-template/edit/editor?read_only=true
  return `${global.aquiferOptions.wsUrl}/projects/${proj}/templates/${proj}-template/edit/editor`;
}

export function getDefaultReadOnlyEditorUrlFromProjName(proj) {
  // https://ue1.autoi.co/projects/project-3/templates/project-3-template/edit/editor?read_only=true
  return `${global.aquiferOptions.wsUrl}/projects/${proj}/templates/${proj}-template/edit/editor?read_only=true`;
}

export function getAcceptInvitationEmail(subject, to, from) {
  const email = getNewestEmail1(subject, to, from);
  return email;
}

export function getVerificationUrlFromEmail(email) {
  const acceptInvitationUrl = email.body.html.split('href="')[1].split('" ')[0];
  console.log('acceptInvitationUrl');
  console.log(acceptInvitationUrl);
  return acceptInvitationUrl;
}

export function getVerificationUrl(emailAddress) {
  const email = getAcceptInvitationEmail("You've been invited to Wordsmith", emailAddress, 'help@automatedinsights.com');
  const verificationUrl = getVerificationUrlFromEmail(email);
  return verificationUrl;
}

// export function acceptInvitationForEmailAddress(emailAddress, password) {
//   const url = getVerificationUrl(emailAddress);
//   Page.load(url);
//   accountInvitationPage.signup(password);
//   termsOfUsePage.agreeCheckbox.click();
//   termsOfUsePage.acceptAndContinueButton.click_waitForNotExisting();
// }

// export function acceptInvitationForInviteUrl(url, emailAddress, password) {
//   Page.load(url);
//   accountInvitationPage.signup(password);
//   termsOfUsePage.agreeCheckbox.click();
//   termsOfUsePage.acceptAndContinueButton.click_waitForNotExisting();
// }


export function acceptInvitation(url, emailAddress, password) {
  Page.load(url);
  accountInvitationPage.signup(password);
  termsOfUsePage.agreeCheckbox.click();
  termsOfUsePage.acceptAndContinueButton.click_waitForNotExisting();
}

// export function getApiKeyFromUi() {
//   dashboardPage.load();

//   Page.load(url);
//   accountInvitationPage.signup(password);
//   termsOfUsePage.agreeCheckbox.click();
//   termsOfUsePage.acceptAndContinueButton.click_waitForNotExisting();
// }
