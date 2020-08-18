// https://github.com/Microsoft/TypeScript/issues/15626
// https://stackoverflow.com/questions/35074713/extending-typescript-global-object-in-node-js

interface ObjectConstructor {
  values: Function;
}
interface AquiferOptions {
  runDate: string;
  runTime: string;
  runId: string;
  wsLogin: string;
  wsPassword: string;
  wsUrl: string;
  wsApiKey: string;


  onnaEmail: string;
  onnaPassword: string;
  onnaUrl: string;

  suite: string;
  s: string;
  n: number;

  notHeadless: boolean;

  tableauLogin: string;
  tableauPassword: string;
  tableauUrl: string;

  hidePassword: boolean;
  noPics: boolean;
  muteConsole: boolean;
  resetReferenceImages: boolean;
  doVisualTests: boolean;
}


interface AquiferLog {
  wdioConf_beforeSuite: Function;
  wdioConf_beforeTest: Function;
  wdioConf_afterTest: Function;
  wdioConf_afterSuite: Function;
  wdioConf_after: Function;
  wdioConf_afterSession: Function;
  logVisualTestReset: Function;
  logVisualTestCreate: Function;
  logVisualTestVerify: Function;
}


declare module NodeJS {
  interface Global {
    aquiferOptions: AquiferOptions;
    customScreenshotTag: string;
    previousImageFileLocation: string;
    doDeleteReferenceImage: boolean;
    filenamify: Function;
    log: AquiferLog;
    doLogVisualTest: boolean;
  }
}
