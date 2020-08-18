
![](icon/icon.svg)
# aquifer

Automated Qa: UI tests For wEbdRiverio

# TODO - out of date since wdio 5 upgrade

## Test aquifer

eg

``npm run dev -- --s aquifer/test/ui-test/slider.test.js``

## Usage

``npm start -- <options>``

eg

``npm start -- --s login.test --n 10 --noPics``


## options

``--s`` spec file name(s) [parts].  this does not need to be a path or full name.  ``glob`` is used to search ``src/ui-test`` for tests that match this string.  multiple tests can be specified by separating with commas or enquoting and separating with spaces, that is ``--s test1,test2,test3`` or ``--s "test1 test2, test3"``.  Case insensitive.  Target specs must end with ".test.js".

``--n`` number of times to run the given spec files.  this happens in parallel with max threads stipulated in wdio.conf.js

``--noPics`` defaults to false - setting this to true prevents screenshots from being taken per logged action.  this will make the testing report less useful, but let the tests run faster 

``--notHeadless`` defaults to false - set this flag to force autobot to load a visible

``--hidePassword``  this will hide all passwords in the console and logs.

``--muteConsole``   prevents actions being displayed in console

``--resetReferenceImages``  resets reference images used for visual testing

``--doVisualTests``  defaults to false cos hitting too many false negatives

## Test

``npm run test``


## Aquifer Rules

*  `super.nameElements();` must be called at the end of every element container constructor (handled with eslint)
*  do not call "browser" from tests.  must be wrapped in autobot functions for proper logging and error handling.
*  all files must start with //@ts-check (handled with eslint)
*  don't use asserts.  every action should be fail-fast and reported clearly.
*  tests including visual tests must end with AquiferAssert.visualTestsPassed(); - this creates soft asserts for visual testing.  (handled with eslint)


notes:

- if you start seeing errors in vscode for references to ``global`` attribute variables, just open ``.d.ts`` for a second -- that should fix things.
- if you're using iTerm2, you can command-click on files in the stack trace to load in your defaul js editor
- browser.scroll doesn't work.
- it's dangerous to ``export`` instantiated ``UiElement`` objects cos something might be tagged as loadCriterion somewhere, but shouldn't be everywhere it's used.
- a spec file must import something that extends UiContainer, otherwise the logging tool will never get created.  this would be unnecessary if mocha supported the ``--file`` option from their command line tools hmph


### other suggestions in review:

*  don't mute eslint rules.  either make eslint happy or remove the rule
*  look at findElements - consider if should really not be static.  and withMessage 
*  !! avoid class methods that don't use 'this' !!

