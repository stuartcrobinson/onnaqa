module.exports = {
  "root": true,
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "parser": "babel-eslint",
  "extends": "airbnb-base",
  "env": {
    "browser": true,
    "mocha": true,
    "webdriverio/wdio": true,
    "es6": true
  },
  "plugins": [
    "webdriverio",
    "aquifer"
  ],
  "rules": {
    "no-console": "off",                    // logs to console
    "class-methods-use-this": "off",        // turned off to allow helper methods within class objects for test readability
    "max-len": "off",
    "no-plusplus": [2, {"allowForLoopAfterthoughts": true}], //to use boring for loops (instead of forEach) for better stack trace
    "import/prefer-default-export": "off",  // non-default makes more sense to me?
    "camelcase": "off",                     // also off in ws
    "no-underscore-dangle": "off",          // so variables can start with a number.  see data.test.js
    "func-names": "off",                    // necessary in mocha describe blocks when using this.retries(n)
    // "aquifer/starts-with-ts-check": 2,   // temporarily disabled until https://autoin.atlassian.net/browse/QS-685 ts support for aquifer
    "aquifer/visual-test-contains-assert": 2,
    "aquifer/uiContainer-child-constructor-ends-with-nameElements": 2
  }
};
