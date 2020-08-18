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
    "no-console": "off",
    "class-methods-use-this": "off",
    "max-len": "off",
    "no-plusplus": [2, { "allowForLoopAfterthoughts": true }],
    "import/prefer-default-export": "off",
    "camelcase": "off",
    "no-use-before-define": "off",
    "no-underscore-dangle": "off",
    "func-names": "off",
    "no-unused-vars": "off",
    "no-unused-expressions": "off",
    "aquifer/starts-with-ts-check": 2,
    "aquifer/visual-test-contains-assert": 2,
    "aquifer/uiContainer-child-constructor-ends-with-nameElements": 2
  }
};
