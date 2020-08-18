// @ts-check
const path = require('path');
const glob = require('glob');
const yargsParse = require('yargs-parser');
const stringArgv = require('string-argv');
const fs = require('fs');
const filenamify = require('filenamify');


const getSpecFilePaths = s => (typeof s === 'object' ? s[s.length - 1] : s) // override default spec files option if multiple --s's passed
  .trim()
  .split(/[ ,]+/)
  .concat('awe8fy9wflasidufasid7yf') // to ensure array length is > 1 to trigger reduce
  .map(x => (x.includes('/') ? x : `*/ui-test/**/*${x}*`))
  .reduce((a, c) => (typeof a === 'string' ? find(a).concat(find(c)) : a.concat(find(c))))
  .filter(file => !file.includes('*'));

const repeatSpecs = (specFilePaths, n) => {
  let specFilePathsRepeated = [];

  Array(n).fill(1).forEach((x) => { specFilePathsRepeated = specFilePathsRepeated.concat(specFilePaths); });

  return specFilePathsRepeated;
};

// Note: this fails when pattern starts w/ './' or '/'
// https://stackoverflow.com/questions/29447637/node-glob-isnt-matching-anything-if-path-starts-with-and-nocase-true-bu
const find = pattern => glob.sync(pattern, { nocase: true });

const isReferenceImage = basePath => basePath.includes('screenshots/reference');

const getCurrScreenshotFile = imgFile => imgFile.replace('screenshots/reference', 'screenshots/screen');

const logScreenshot = (imgFile) => {
  const currScreenshotFile = getCurrScreenshotFile(imgFile);

  if (global.doDeleteReferenceImage) {
    global.log.logVisualTestReset(currScreenshotFile);
  } else if (!fs.existsSync(imgFile)) {
    global.log.logVisualTestCreate(currScreenshotFile);
  } else {
    global.log.logVisualTestVerify(currScreenshotFile);
  }
};

const handleLogScreenshot = (imgFile) => {
  if (global.doLogVisualTest) { // don't want to log every test when retrying
    global.previousImageFileLocation = imgFile; // Used to display the diff image in the html report.

    if (isReferenceImage(imgFile)) {
      logScreenshot(imgFile);
    }
  }
};

const handleReferenceImageReset = (imgFile) => {
  /* Reset visual test reference image. */

  if (global.doDeleteReferenceImage && isReferenceImage(imgFile)) {
    if (!fs.existsSync(imgFile)) {
      throw new Error(`You tried to delete a reference image that does not exist.  Images are specific to environment (including headless or not).  File: ${imgFile}`);
    } else {
      fs.unlinkSync(imgFile);
    }
  }
};

module.exports = {
  TMP_DIR: 'tmp',
  ARGS_FILE: 'args.txt',
  PASSWORDS_FILE: '.passwords',
  POINTLESS_ANNOYING_WDIO_ERROR_SHOTS_DIR: `${this.TMP_DIR}/errorShots`,

  getFlagFile_didPrintSpecs() {
    return `${this.TMP_DIR}/printedSpecsToRun${global.aquiferOptions.runId}`;
  },

  getFlagFile_progress() {
    return `${this.TMP_DIR}/progressFile${global.aquiferOptions.runId}`;
  },

  initializeDirs() {
    !fs.existsSync(this.TMP_DIR) && fs.mkdirSync(this.TMP_DIR);
  },


  setGlobals() {
    const optionsFileContents = fs.existsSync(this.ARGS_FILE) ? yargsParse(stringArgv(fs.readFileSync(this.ARGS_FILE).toString())) : '';
    const passwordsFileContents = fs.existsSync(this.PASSWORDS_FILE) ? yargsParse(stringArgv(fs.readFileSync(this.PASSWORDS_FILE).toString())) : '';
    const options = { ...optionsFileContents, ...passwordsFileContents, ...yargsParse(process.argv) };

    // const options = { ...optionsFileContents, ...yargsParse(process.argv) };
    if (options.runTime) {
      options.runTime = options.runTime.toLowerCase().trim();
    }
    options.runId = `${options.runDate}_${options.runTime}`;
    // @ts-ignore
    global.aquiferOptions = options;

    global.filenamify = function (str) {
      return filenamify(str.replace(/ /g, '_')).replace(/#/g, '');
    };

    if (global.aquiferOptions.resetReferenceImages) {
      global.doDeleteReferenceImage = true;
    }
  },


  /** For wdio-visual-regression-service.  Used by AquiferLog.  */
  getScreenshotFile(basePath) {
    return function (context) {
      const { type } = context;
      const testName = context.test.fullTitle;
      const browserVersion = parseInt(context.browser.version, 10);
      const browserName = context.browser.name;
      const browserViewport = context.meta.viewport;
      const { width: browserWidth, height: browserHeight } = browserViewport;

      const imgFile = path.join(basePath,
        `${global.filenamify(`${testName}_${type}_${global.customScreenshotTag}_${browserName}_v${browserVersion}_${browserWidth}x${browserHeight}`)}.png`);

      handleLogScreenshot(imgFile);

      handleReferenceImageReset(imgFile);

      return imgFile;
    };
  },


  /**
   * Builds an array of filepaths to be used as a wdio suite, defined below.
   *
   * @param {string | Array} s from --s (for spec files) input.  Will be an array if --s was specified multiple times in which case only the last element of the array will be used.  This allows an overrideable default to be listed in the npm script.  The --s term can be a substring of a spec file name, or multiple test substrings concatenated by comma or space.
   * Defaults to '.test' which matches any test (a la '*.test.js')
   * @param {number} n number of times to run all the matched spec files.  Useful for test development, so you can run a test a bunch of times to make sure it's not "flaky".
   */
  buildSpecsArrayForWdioSuite(s = '.test', n = 1) {
    const specFilePaths = getSpecFilePaths(s);

    const specFilePathsRepeated = repeatSpecs(specFilePaths, n);

    if (this.doPrintSpecsToRun()) {
      console.log(`🔨 Preparing to run the following spec file${specFilePaths.length > 1 ? 's' : ''}${n > 1 ? (` ${n} times`) : ''}:`);
      console.log(specFilePaths);
    }

    return specFilePathsRepeated;
  },

  //  services: ['visual-regression', ''],


  buildServicesArray() {
    if (global.aquiferOptions.seleniumStandalone) {
      return ['visual-regression', 'selenium-standalone'];
    }
    return ['visual-regression'];
  },


  doPrintSpecsToRun() {
    const FILE = this.getFlagFile_didPrintSpecs();
    if (fs.existsSync(FILE)) {
      return false;
    }

    fs.writeFileSync(FILE, 'existence of this file means that specs to run were already printed in console and should not be reprinted.  this file should be deleted when all tests finish.');
    return true;
  },


  getChromeBinaryLocation() {
    switch (process.platform) {
      case 'darwin':
        return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
      case 'linux':
        return '/usr/bin/google-chrome-stable';
      default:
        throw Error(`unexpected platform: ${process.platform}`);
    }
  },
};
