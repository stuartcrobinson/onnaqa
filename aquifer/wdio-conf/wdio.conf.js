// @ts-check
/* ************************************************************************************************************ */
/* **** This is the WebdriverIO configuration file.  It's not using ES6 cos I couldn't figure out how. ******** */
/* **** It's accessing external local files using the global object since it can't run ES6 code. -Stuart ****** */
/* ************************************************************************************************************ */

// use this file if starting selenium server using docker (to avoid downloading java).  otherwise, use wdio.conf.selenium-standalone.js

// console.log('here in main wdio conf file')

const path = require('path');
// const VisualRegressionCompare = require('wdio-visual-regression-service/compare');
const glob = require('glob');
const fs = require('fs');
const rimraf = require('rimraf');
const h = require('./helper.js');

h.initializeDirs();
h.setGlobals();

exports.config = {
  // port: 9515, // default for ChromeDriver

  //
  // ====================
  // Runner Configuration
  // ====================
  //
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: 'local',
  //
  // Override default path ('/wd/hub') for chromedriver service.
  path: '/',
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: [
    // './test/spec/basic.js'
    './src/ui-test/login.test.js'
    // './src/ui-test/**/*.js'  //note: don't use this.  gives annoying output.  use yarn start and use --s to specify tests
  ],
  // define specific suites
  // NOTE - don't use wildcards here.  it will "work" but only run the first match, i think.
  suites: {
    dev: global.aquiferOptions.suite === 'dev' ? h.buildSpecsArrayForWdioSuite(global.aquiferOptions.s, global.aquiferOptions.n) : [],
  },
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 10,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [{
    // maxInstances can get overwritten per capability. So if you have an in-house Selenium
    // grid with only 5 firefox instances available you can make sure that not more than
    // 5 instances get started at a time.
    maxInstances: 10,

    browserName: 'chrome',
    'goog:chromeOptions': global.aquiferOptions.notHeadless ? {} : {
      args: ['--headless', '--disable-gpu', '--window-size=1280,800'],
      // binary: h.getChromeBinaryLocation(),
    },
  }],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // e.g. using promises you can set the sync option to false.
  sync: true,
  //
  // Level of logging verbosity: silent | verbose | command | data | result | error
  logLevel: 'silent',
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // Warns when a deprecated command is used
  deprecationWarnings: false,
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: `${h.POINTLESS_ANNOYING_WDIO_ERROR_SHOTS_DIR}/`, // get saved to variable locations if not stipulated
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: 'http://localhost',
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 20000,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  // services: h.buildServicesArray(),  stuart commented jan 13
  services: ['chromedriver'],
  // chromeDriverArgs: ['--port=9515', '--url-base=\'/\''], // default for ChromeDriver


  // from wdio main page:
  // visualRegression: {
  //   compare: new VisualRegressionCompare.LocalCompare({
  //     referenceName: h.getScreenshotFile(path.join(process.cwd(), 'screenshots/reference')),
  //     screenshotName: h.getScreenshotFile(path.join(process.cwd(), 'screenshots/screen')),
  //     diffName: h.getScreenshotFile(path.join(process.cwd(), 'screenshots/diff')),
  //     misMatchTolerance: 0.00,
  //   }),
  //   // viewportChangePause: 300,
  //   // viewports: [{ width: 320, height: 480 }, { width: 480, height: 320 }, { width: 1024, height: 768 }],
  //   // orientations: ['landscape', 'portrait'],
  // },
  // visualRegression: {
  //   compare: new VisualRegressionCompare.LocalCompare({
  //     referenceName: getScreenshotName(path.join(process.cwd(), 'screenshots/reference')),
  //     screenshotName: getScreenshotName(path.join(process.cwd(), 'screenshots/taken')),
  //     diffName: getScreenshotName(path.join(process.cwd(), 'screenshots/diff')),
  //   }),
  // },
  //
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'mocha',
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: http://webdriver.io/guide/reporters/dot.html
  reporters: ['spec'],
  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000,
    compilers: ['js:@babel/register'],
    file: 'mocha.global.js',
    require: ['tsconfig-paths/register']
  },

  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  before: function () {
    // not needed for Cucumber
    require('ts-node').register({ files: true })
  },
  /**
   * Hook that gets executed before the suite starts.  (Suite is a mocha thing, not the wdio.conf-defined "suites" above.  So there is 1 spec file per suite. - stuart)
   * @param {Object} suite suite details
   */
  beforeSuite(suite) {
    if (!global.log) {
      console.log("Logging object doesn't exist on the global var. import a page or UiElement into your test to fix this.");
      process.abort();
    }
    global.log.wdioConf_beforeSuite(suite, h.getFlagFile_progress());
  },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
   * @param {Object} test test details
   */
  beforeTest(test) {
    global.log.wdioConf_beforeTest(test);
  },
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function () {
  // },
  /**
   * Hook that gets executed _after_ a hook within the suite ends (e.g. runs after calling
   * afterEach in Mocha)
   */
  // afterHook: function () {
  // },
  /**
   * Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) ends.
   * @param {Object} test test details
   */
  afterTest(test, context, { error, result, duration, passed, retries }) {
    // global.log.wdioConf_afterTest(test.passed, test.err);
    global.log.wdioConf_afterTest(passed, error);
  },
  /**
   * Hook that gets executed after the suite has ended
   * @param {Object} suite suite details
   */
  afterSuite(suite) {
    global.log.wdioConf_afterSuite(suite.err);
  },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  after(result, capabilities, specs) {
    global.log && global.log.wdioConf_after();
  },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  afterSession(config, capabilities, specs) {
    global.log && global.log.wdioConf_afterSession();
  },
  /**
   * Gets executed after all workers got shut down and the process is about to exit.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onComplete(exitCode, config, capabilities) {
    console.log(fs.readFileSync(h.getFlagFile_progress()).toString());
    rimraf.sync(h.TMP_DIR);
    try {
      // remove ERROR_*.png files & parent dir saved in bizarre places by wdio, i think it's a wdio bug
      const files = glob.sync('**/ERROR_*');
      const file = files[0];
      const parent = path.basename(path.dirname(file));
      rimraf.sync(parent);
      rimraf.sync('undefined'); // holds error shots some time
    } catch (err) { /* do nothing */ }
  },
};
// console.log('after in main wdio conf file')
