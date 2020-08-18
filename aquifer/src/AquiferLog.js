// @ts-check
/* eslint prefer-destructuring: "off" */
import colors from 'colors/safe';
import dateFormat from 'dateformat';
import * as fs from 'fs';
import * as fs_extra from 'fs-extra';
import { AllHtmlEntities } from 'html-entities';
import * as os from 'os';
import * as path from 'path';
import rimraf from 'rimraf';
import { html } from './HtmlBuilder';

const entities = new AllHtmlEntities();

export const A_VISUAL_TEST_FAILED = 'A visual test failed.';

function passthrough(message) {
  return message;
}

/** holds DOMs as well as event screenshots */
const EVENT_SNAPSHOTS_DIR_NAME = 'eventSnapshots';
const ERROR_SNAPSHOTS_DIR_NAME = 'errorSnapshots';
/** these files get copied from the visual regression service when an image test fails. */
const DIFF_IMAGES_DIR_NAME = 'diffImages';

/**
 *
 * @param {Object} style has a parameter '_styles' which is an array of strings describing the style, like "red", or "emoji"
 */
function convertStylesToClassValue(style) {
  return style && style._styles ? style._styles.join(' ') : '';
}

function getEventScreenshotFileRelPath(id) {
  return `${EVENT_SNAPSHOTS_DIR_NAME}/${id}.png`;
}

function getErrorScreenshotFileRelPath(id) {
  return `${ERROR_SNAPSHOTS_DIR_NAME}/${id}.png`;
}

function getDiffImageCopyRelPath(base) {
  return `${DIFF_IMAGES_DIR_NAME}/${base}`;
}

/**
 *
 * @param {string} fullTitle
 * @param {string} title
 * @param {string} parent
 */
const getGrandparentsTitle = (fullTitle, title, parent) => {
  const bitToRemove = `${parent} ${title}`;
  return fullTitle.replace(bitToRemove, '');
};

const isSingleSelector = (style, text) => !text.startsWith(' excluding') && (style === aquiferStyle.selector || style === aquiferStyle.selector_red);

const toHtmlString = ({ style = passthrough, text = '' }) => {
  const classValue = convertStylesToClassValue(style);

  if (text.startsWith('http')) {
    return html.link(classValue, text);
  }
  if (isSingleSelector(style, text)) {
    return html.dblclickableSelector(classValue, text);
  }
  return html.text(classValue, text);
};

const toConsoleString = ({ style, text }) => `${typeof style === 'function' ? style(text) : text}`;

const cleanPassword = (message) => {
  if (message.style === aquiferStyle.password) {
    message.text = message.text.replace(/[^\s]/g, '•');
    message.style = aquiferStyle.object;
  }
  return message;
};


const getScreenshotId = (currDateObject = new Date()) => dateFormat(currDateObject, 'hh:MM:ss.lTT').toLowerCase();

const aquiferStyle = {
  verb: colors.italic,
  // @ts-ignore
  verb_red: colors.italic.red,
  object: colors.bold,
  // @ts-ignore
  object_red: colors.bold.red,
  filler: colors.reset,
  // @ts-ignore
  filler_red: colors.red,
  // @ts-ignore
  selector_red: colors.dim.red,
  selector: colors.gray,
  emoji: { _styles: ['emoji'] },
  password: 'password',
};
// @ts-ignore
const FAILURE_MESSAGES = [{ text: '❌ ', style: aquiferStyle.emoji }, { text: 'FAIL', style: colors.red.bold }];

class AquiferLog {
  constructor() {
    this.doPrintToConsole = !global.aquiferOptions.muteConsole;
    this.doSaveEventScreenshots = !global.aquiferOptions.noPics;
    this.style = aquiferStyle;
    this.screenshotTargetName = undefined;
    this.screenshotTargetSelector = undefined;
    this.specFailed = false;
    this.aVisualTestFailed = false;
    this.errorMidpointScreenshotIds = [];
    this.errorMidpointScreenshotIds_printed = [];
  }


  /**
     * Called in global "before", once test's spec file path has been determined.
     * @param {String} specFile
     */
  initialize(specFile) {
    this.isInTestCase = false;
    this.hasPrintedNontestLine = false;

    const randomWait = Math.floor(Math.random() * 1000);
    browser.pause(randomWait); // to prevent two parallel-running tests from starting at exactly the same time

    const testParentDateTime = new Date();

    this.specMillis = dateFormat(testParentDateTime, 'l');
    this.specTime = dateFormat(testParentDateTime, 'hh:MM:ss.lTT').toLowerCase();
    this.specDate = dateFormat(testParentDateTime, 'yyyymmdd');

    this.specFilePath = specFile;

    fs_extra.mkdirsSync(this.getReportDir());
    fs_extra.mkdirsSync(this.getEventScreenshotsDir());
    fs_extra.mkdirsSync(this.getErrorScreenshotsDir());
    fs_extra.copySync('./aquifer/icon', `${this.getReportDir()}/icon`);

    this.logRawToHtml(html.pageInitialize(this.getSpecFileTestlessName(), this.doSaveEventScreenshots, this.getRelativeSpecFilePath()));
  }

  initializeNewTestCase(testCaseTitle, testParentTitle, testCaseFullTitle, testGrandparentsTitle) {
    this.isInTestCase = true;
    this.testCaseTitle = testCaseTitle;
    this.testParentTitle = testParentTitle;
    this.testCaseFullTitle = testCaseFullTitle;
    this.testGrandparentsTitle = testGrandparentsTitle;
    this.hasPrintedNontestLine = false;
  }

  endNewTestCase() {
    this.isInTestCase = false;
    this.testCaseTitle = undefined;
    this.testCaseFullTitle = undefined;
    this.hasPrintedNontestLine = false;
  }

  getSpecFileName() {
    const split = this.specFilePath.split('/');
    return split[split.length - 1].replace('.js', '');
  }

  getRelativeSpecFilePath() {
    if (this.specFilePath.includes('/src')) {
      const split = this.specFilePath.split('/src');
      const toHide = split[0];
      const toShow = this.specFilePath.replace(toHide, '');
      return toShow;
    }
    return this.specFilePath;
  }

  getSpecFileTestlessName() {
    const split = this.specFilePath.split('/');
    return split[split.length - 1].replace('.test.js', '');
  }

  getSpecFileDirName() {
    const split = this.specFilePath.split('/');
    return split[split.length - 2];
  }

  getDateDir() {
    return `aquiferlog/${global.aquiferOptions.runDate}`;
  }

  getTimeDir() {
    return `${this.getDateDir()}/${global.aquiferOptions.runTime}`;
  }

  /** one log file per test js file */
  getReportDir() {
    const result = `${this.getTimeDir()}/${this.getSpecFileName()}_${this.specTime}`.replace('.test', '');
    return result;
  }

  getEventScreenshotsDir() {
    return `${this.getReportDir()}/${EVENT_SNAPSHOTS_DIR_NAME}`;
  }

  getErrorScreenshotsDir() {
    return `${this.getReportDir()}/${ERROR_SNAPSHOTS_DIR_NAME}`;
  }

  getDiffImagesDir() {
    return `${this.getReportDir()}/${DIFF_IMAGES_DIR_NAME}`;
  }

  getEventDomFileAbsPath(id) {
    return `${this.getEventScreenshotsDir()}/${id}.html`;
  }

  getEventScreenshotFileAbsPath(id) {
    return `${this.getEventScreenshotsDir()}/${id}.png`;
  }

  getErrorScreenshotFileAbsPath(id) {
    return `${this.getErrorScreenshotsDir()}/${id}.png`;
  }

  getDiffImageCopyAbsPath(base) {
    return `${this.getDiffImagesDir()}/${base}`;
  }

  getSpacelessTestCaseFullTitle() {
    if (this.isInTestCase) {
      return global.filenamify(this.testCaseFullTitle.replace(/ /g, '_'));
    }

    return global.filenamify(this.testParentTitle.replace(/ /g, '_'));
  }

  getFile() {
    return `${this.getReportDir()}/index.html`;
  }

  get reportClickablePathWithHash() {
    return `${this.reportClickablePath}#${this.getSpacelessTestCaseFullTitle()}`;
  }

  get reportClickablePath() {
    return `file://${path.resolve(this.getFile())}`;
  }

  saveScreenshotWhileWaiting() {
    const screenshotId = getScreenshotId();
    this.errorMidpointScreenshotIds.push(screenshotId);
    this.saveErrorScreenshot(screenshotId);
  }


  saveEventScreenshot(screenshotId, screenshotFile = undefined) {
    if (this.doSaveEventScreenshots) {
      this.saveScreenshot(this.getEventScreenshotFileAbsPath(screenshotId), screenshotFile);
    }
  }

  logScreenshottedText(text) {

    const messages = [{ text }];

    const screenshotId = log.logRichMessages(messages);

    this.saveEventScreenshot(screenshotId);
  }

  saveErrorScreenshot(screenshotId) {
    this.saveScreenshot(this.getErrorScreenshotFileAbsPath(screenshotId));
  }

  saveScreenshot(destination, optionalScreenshotSourceFile = undefined) {
    if (optionalScreenshotSourceFile) {
      // screenshotFile from visual regression service.  using it instead of taking new screenshot
      // screenshotFile doens't exist yet!  but it will in a second.
      // need to spin off a thread that will wait until the file exists, and then copy it.
      // or wait to copy until later??? no, this might be the last step of a test.

      browser.call(() => {
        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function demo() {
          let count = 0;
          while (!fs.existsSync(optionalScreenshotSourceFile)) {
            /* eslint no-await-in-loop: "off" */
            await sleep(100);
            count += 1;
            if (count > 100) { // after 10 seconds
              break;
            }
          }
          fs.copyFileSync(optionalScreenshotSourceFile, destination);
        }
        demo();
      });
    } else {
      browser.saveScreenshot(destination);
    }
  }

  /**
   *
   * @param {Array | undefined} messages
   * @param {string | undefined} screenshotFile
   */
  logRichMessagesWithScreenshot(messages = [], screenshotFile = undefined) {
    const screenshotId = this.logRichMessages(messages);
    this.saveEventScreenshot(screenshotId, screenshotFile);
  }

  /**
   *
   * @param {string} message
   * @param {string | undefined} screenshotFile
   */
  logScreenshottedMessage(message = '', screenshotFile = undefined) {
    const screenshotId = this.logPrefixedText(message);
    this.saveEventScreenshot(screenshotId, screenshotFile);
  }

  logPrefixedText(message) {
    return this.logRichMessages([{ text: message }]);
  }

  initializeConsoleString(withPrefix, currDateObject) {
    if (!withPrefix) {
      return '';
    }

    const currTime = dateFormat(currDateObject, 'hh:MM:sstt');

    if (this.isInTestCase) {
      return `${currTime} ${colors.gray(`${this.testGrandparentsTitle} ${this.testParentTitle}`.trim())} ${this.testCaseTitle}> `;
    }
    return `${currTime} ${colors.gray(this.getSpecFileDirName())}/${this.getSpecFileName()}>  `;
  }

  initializeHtmlString(withPrefix, withScreenshot, currDateObject) {
    const currTime = dateFormat(currDateObject, 'hh:MM:sstt');
    const currDate = dateFormat(currDateObject, 'yyyymmdd');

    const screenshotId = getScreenshotId(currDateObject);

    const onmouseoverHtml = withScreenshot ? ` onmouseover="logEntryMouseover('${screenshotId}', '${getEventScreenshotFileRelPath(screenshotId)}');"` : '';

    let htmlBuilder = `<span class="logline" id="entrySpan${screenshotId}" ${onmouseoverHtml}>`;

    htmlBuilder += withPrefix ? entities.encode(`${currDate} ${currTime}> `) : '';

    return htmlBuilder;
  }

  logRichMessages(messages = [], { withPrefix = true, withScreenshot = true } = {}) {
    if (withPrefix && messages !== FAILURE_MESSAGES) {
      // new logline, so delete old unused midpoint images and clear errorMidpointScreenshotIds array
      this.deleteUnusedMidpointErrorScreenshots();
    }
    const currDateObject = new Date();

    if (!this.isInTestCase && !this.hasPrintedNontestLine) {
      this.logHorizontalLine();
      this.hasPrintedNontestLine = true;
    }

    let consoleBuilder = this.initializeConsoleString(withPrefix, currDateObject);
    let htmlBuilder = this.initializeHtmlString(withPrefix, withScreenshot, currDateObject);

    messages.forEach((message) => {
      message = cleanPassword(message);

      htmlBuilder += toHtmlString(message);
      consoleBuilder += toConsoleString(message);
    });
    htmlBuilder += '</span><br/>';
    this.logRawToHtml(htmlBuilder);

    if (this.doPrintToConsole) {
      console.log(consoleBuilder);
    }
    return getScreenshotId(currDateObject);
  }

  logErrorImageToHtml(screenshotId) {
    this.errorMidpointScreenshotIds.forEach((id) => {
      this.logRawToHtml(
        `<span class='errorimgname'>${id}</span><br/><img id="logErrorImage" src=${getErrorScreenshotFileRelPath(id)} width=45%></img><br/>`,
      );
      this.errorMidpointScreenshotIds_printed.push(id);
    });

    this.logRawToHtml(
      `<span class='errorimgname'>${screenshotId}</span><br/><img id="logErrorImage" src=${getErrorScreenshotFileRelPath(screenshotId)} width=45%></img><br/>`,
    );

    this.errorMidpointScreenshotIds = [];
  }

  logFailedVisualTest(diffImageFilePath, report) {
    if (!fs.existsSync(this.getDiffImagesDir())) {
      fs.mkdirSync(this.getDiffImagesDir());
    }

    const diffImageNewAbsPath = this.getDiffImageCopyAbsPath(path.parse(diffImageFilePath).base.replace(/ /g, '_'));
    const diffImageNewRelPath = getDiffImageCopyRelPath(path.parse(diffImageFilePath).base.replace(/ /g, '_'));

    fs.copyFileSync(diffImageFilePath, diffImageNewAbsPath);

    this.logRichMessages([{ text: `Visual test failed: ${JSON.stringify(report)}`, style: colors.red }], { withScreenshot: false });

    this.logWithoutPrefix_toHtml('Diff image: ', colors.red);

    this.logRawToHtml(`<img style="width:35%" src="${diffImageNewRelPath}"><br>`);
  }

  logWithoutPrefix(message, style) {
    this.logWithoutPrefix_toConsole(message, style);
    this.logWithoutPrefix_toHtml(message, style);
  }

  logRawToHtml(text) {
    fs.appendFileSync(this.getFile(), text + os.EOL);
  }

  logHorizontalLine() {
    if (this.doPrintToConsole) {
      console.log('---------------------------------------------------------------------------------------');
      console.log('');
    }
    this.logRawToHtml('<hr/><br/>');
  }

  /* eslint no-param-reassign: "off" */
  logWithoutPrefix_toHtml(message, style) {
    const classValue = convertStylesToClassValue(style);

    this.logRawToHtml(`<span class="whitespace ${classValue}">${entities.encode(message)}</span><br/>`);
  }

  /* eslint no-param-reassign: "off" */
  logWithoutPrefix_toConsole(message, style) {
    if (!style) {
      style = passthrough;
    }
    if (this.doPrintToConsole) {
      console.log(style(message));
    }
  }

  // run this before "it"
  logTestStart() {
    this.logRawToHtml(`<span id=${this.getSpacelessTestCaseFullTitle()}></span>`);
    this.logHorizontalLine();

    this.logRichMessages([
      { text: 'Starting test:  ', style: colors.bold },
      { text: `${this.testGrandparentsTitle} `, style: colors.reset },
      { text: `${this.testParentTitle} `, style: colors.blue },
      // @ts-ignore
      { text: this.testCaseTitle, style: colors.bold.blue },
    ], { withPrefix: false, withScreenshot: false });
    this.logWithoutPrefix('');
  }

  logPassed() {
    // @ts-ignore
    this.logRichMessagesWithScreenshot([{ text: '✅ ', style: this.style.emoji }, { text: 'PASS', style: colors.green.bold }]);
  }


  logFailed(stack) {
    this.specFailed = true;


    if (stack.includes(A_VISUAL_TEST_FAILED)) {
      this.logRichMessages(FAILURE_MESSAGES, { withScreenshot: false });
      this.logRawToHtml(`<span name="thisIsWhereStackGoes" class="monospace red"><pre>${entities.encode(stack)}</pre></span><br/>`);
    } else {
      this.logRichMessagesWithScreenshot(FAILURE_MESSAGES);

      this.logRawToHtml(`<span name="thisIsWhereStackGoes" class="monospace red"><pre>${entities.encode(stack)}</pre></span><br/>`);


      const screenshotId = getScreenshotId();

      browser.saveScreenshot(this.getErrorScreenshotFileAbsPath(screenshotId));
      this.logErrorImageToHtml(screenshotId);

      // replace favicon with favicon_fail
      let reportContents = fs.readFileSync(this.getFile()).toString();
      reportContents = reportContents.replace('favicon', 'favicon_fail');
      fs.writeFileSync(this.getFile(), reportContents);
    }
  }

  /** Called from global in wdio.conf.js */
  logVisualTestReset(screenshotFile) {
    this.logRichMessagesWithScreenshot([
      { text: '📷 ', style: this.style.emoji },
      { text: 'Reset ', style: this.style.verb_red },
      { text: 'screenshot ', style: this.style.filler_red },
      { text: this.screenshotTargetName, style: this.style.object_red },
      { text: this.screenshotTargetSelector, style: this.style.selector_red }],
      screenshotFile);
  }

  /** Called from global in wdio.conf.js */
  logVisualTestCreate(screenshotFile) {
    this.logRichMessagesWithScreenshot([
      { text: '📷 ', style: this.style.emoji },
      { text: 'Save ', style: this.style.verb_red },
      { text: 'screenshot ', style: this.style.object_red },
      { text: this.screenshotTargetName, style: this.style.object_red },
      { text: this.screenshotTargetSelector, style: this.style.selector_red }],
      screenshotFile);
  }

  /** Called from global in wdio.conf.js */
  logVisualTestVerify(screenshotFile) {
    this.logRichMessagesWithScreenshot([
      { text: '📸 ', style: this.style.emoji },
      { text: 'Verify ', style: this.style.verb },
      { text: 'screenshot ', style: this.style.object },
      { text: this.screenshotTargetName, style: this.style.object },
      { text: this.screenshotTargetSelector, style: this.style.selector }],
      screenshotFile);
  }

  wdioConf_beforeSuite(suite, runId) {
    this.isInTestCase = false;
    this.specFilePath = suite.file;
    this.testCaseTitle = undefined;
    this.testParentTitle = suite.parent;
    this.testCaseFullTitle = suite.fullTitle;
    this.testGrandparentsTitle = undefined;
    this.runId = runId;

    this.initialize(this.specFilePath);
    if (this.doPrintToConsole) {
      console.log('');
    }
    console.log('📝 ', this.reportClickablePath, '\n');
  }


  deleteUnusedMidpointErrorScreenshots() {
    // delete unused midpoint screenshots
    this.errorMidpointScreenshotIds
      .filter(id => !this.errorMidpointScreenshotIds_printed.includes(id))
      .forEach(id => fs.unlinkSync(this.getErrorScreenshotFileAbsPath(id)));

    this.errorMidpointScreenshotIds_printed = [];
    this.errorMidpointScreenshotIds = [];
  }

  wdioConf_beforeTest(test) {
    const grandparentsTitle = getGrandparentsTitle(test.fullTitle, test.title, test.parent);
    this.initializeNewTestCase(test.title.trim(), test.parent.trim(), test.fullTitle.trim(), grandparentsTitle.trim());
    this.logTestStart();
  }

  /** called from wdio.conf.js */
  wdioConf_after() {
    if (!global.aquiferOptions.muteConsole) {
      console.log('\n📝 ', this.reportClickablePath, '\n');
    }
  }

  /** called from wdio.conf.js */
  wdioConf_afterSession() {
    fs.appendFileSync(this.runId, `${this.specFailed ? '❌ ' : '✅ '} ${this.reportClickablePath}${os.EOL}`);

    // so you can scroll code up so the screenshot isn't blocking it
    for (let i = 0; i < 30; i++) {
      this.logRawToHtml('</br>');
    }

    rimraf.sync('screenshots/screen');
  }

  /**
   * Called from wdio.conf.js after testcase or suite completion
   * @param {boolean} testDidPass
   * @param {*} err
   */
  wdioConf_afterTest(testDidPass, err) {
    // if test passed, ignore, else take and save screenshot.
    if (testDidPass) {
      this.logPassed();
    } else {
      console.log('problem here????? no err????')
      this.logFailed(err.stack);
      console.log(`📉 ❌ ${this.reportClickablePathWithHash}`);
    }
    this.endNewTestCase();
  }

  wdioConf_afterSuite(err) {
    if (err) {
      this.wdioConf_afterTest(false, err);
    }
  }
}

export const log = new AquiferLog();

global.log = log;
