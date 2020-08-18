// @ts-check
import 'path';
import * as gmail from 'gmail-tester';
import { log } from './AquiferLog';

export function getNewestEmail1(subject, to, from) {
  const to_ = to.toLowerCase();
  const from_ = from.toLowerCase();
  log.logRichMessagesWithScreenshot([
    { text: '📧 ', style: log.style.emoji },
    { text: 'Check email ', style: log.style.verb },
    { text: 'subj: ', style: log.style.filler },
    { text: subject, style: log.style.object },
    { text: ', from: ', style: log.style.filler },
    { text: from, style: log.style.object },
    { text: ', to: ', style: log.style.filler },
    { text: to, style: log.style.object }]);

  const email = browser.call(() => gmail.check_inbox(
    './resources/gmail-api/credentials.json',
    './resources/gmail-api/token.json',
    subject,
    from_,
    to_, // this can be like 'wordsmithqa+blahlblahalsdf@gmail.com'
    10, // Poll interval (in seconds).
    900, // Maximum poll time (in seconds), after which we'll giveup. yes this takes 15+ minutes sometimes - stuart.  not waiting the whole time ... need to fix some wdio timeout prob
    { include_body: true }, // If we want to include the body of messages (optional)
  ));

  return email;
}
