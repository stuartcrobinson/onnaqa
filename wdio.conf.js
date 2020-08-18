const merge = require('deepmerge');
const yargsParse = require('yargs-parser');
const stringArgv = require('string-argv');
const fs = require('fs');
const wdioConf = require('./aquifer/wdio-conf/wdio.conf.js');

// check for mandatory input parameters from command line or args.txt file and mask production passwords by default

const ARGS_FILE = 'args.txt';
const PASSWORDS_FILE = '.passwords';

const optionsFileContents = fs.existsSync(ARGS_FILE) ? yargsParse(stringArgv(fs.readFileSync(ARGS_FILE).toString())) : '';
const passwordsFileContents = fs.existsSync(PASSWORDS_FILE) ? yargsParse(stringArgv(fs.readFileSync(PASSWORDS_FILE).toString())) : '';
const options = { ...optionsFileContents, ...passwordsFileContents, ...yargsParse(process.argv) };

if (options.onnaEnv) {
  switch (options.onnaEnv) {
    case 'onna_env_prod':
      global.aquiferOptions.onnaUrl = global.aquiferOptions.onnaProdUrl;
      global.aquiferOptions.onnaEmail = global.aquiferOptions.onnaProdEmail_admin;
      global.aquiferOptions.onnaPassword = global.aquiferOptions.onnaProdPassword_admin;
    default:
  }
}

// console.log("global.aquiferOptions::")
// console.log(global.aquiferOptions)

if (!global.aquiferOptions.onnaUrl || !global.aquiferOptions.onnaEmail || !global.aquiferOptions.onnaPassword) {
  throw new Error(`Missing input parameters.  Save values to ${ARGS_FILE} or ${PASSWORDS_FILE} (see .passwords-example) or pass in through command line: '--onnaEmail <email> --onnaPassword <password> --onnaUrl <onna base url>'`);
}

global.aquiferOptions.hidePassword = options.hidePassword || global.aquiferOptions.onnaUrl.includes('enterprise.onna.com');

// console.log('herrreee?????')

exports.config = merge(wdioConf.config, {}, { clone: false });
