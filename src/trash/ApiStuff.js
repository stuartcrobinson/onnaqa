import axios from 'axios';
import fs from 'fs';
import { apiAccessPage } from './ui-model/wordsmith/misc/page/apiAccess';
import { log } from '../../aquifer/src';

function base64_encode(file) {
  // read binary data
  const bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString('base64');
}

function getAxiosBodyWithFileData64(projectName, file, data64) {
  return {
    data: {
      name: projectName,
      dataset: {
        format: 'csv',
        filename: file,
        content: data64,
      },
    },
  };
}

function getAxiosBodyWithDataObject(projectName, projectData) {
  return {
    data: {
      name: projectName,
      dataset: {
        format: 'json',
        data: projectData,
      },
    },
  };
}

export function httpRequestBegin(url, body) {
  if (!global.aquiferOptions.wsApiKey) {
    global.aquiferOptions.wsApiKey = apiAccessPage.load().apiKeyInput.getWebElement().getValue();
  }

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${global.aquiferOptions.wsApiKey}`,
      'User-Agent': 'Autobot',
      'Content-Type': 'application/json',
    },
  };
  // log.logPrefixedText('url');
  // log.logPrefixedText(url);
  // log.logPrefixedText('body');
  // log.logPrefixedText(JSON.stringify(body));
  // log.logPrefixedText('axiosConfig');
  // log.logPrefixedText(JSON.stringify(axiosConfig));

  // console.log('url');
  // console.log(url);
  // console.log('body');
  // console.log(body);
  // console.log('axiosConfig');
  // console.log(axiosConfig);
  return axios.post(url, body, axiosConfig);
}


/**
   *
   * @param {import('axios').AxiosPromise} axiosPromise
   */
export function httpRequestComplete(axiosPromise) {
  browser.call(() => axiosPromise
    .then(() => {
      // do nothing
    })
    .catch((error) => {
      throw new Error(error); // trace is useful this way
    }));
}


export function httpRequestCreateProjectFromDataObject(name, data) {
  log.logRichMessages([
    { text: '☁️  ', style: log.style.emoji },
    { text: `Api use data object to create project: ${name}`, style: log.style.filler }], { withScreenshot: false });

  const body = getAxiosBodyWithDataObject(name, data);

  // const url = 'https://api.automatedinsights.com/v1.8/projects';
  const url = `${global.aquiferOptions.wsApiUrl}/projects`;

  const httpRequestPromise = httpRequestBegin(url, body);
  httpRequestComplete(httpRequestPromise);
}


export function httpRequestCreateProjectFromDataFile_begin(name, file) {
  const data64 = base64_encode(file);

  const body = getAxiosBodyWithFileData64(name, file, data64);

  // return httpRequestBegin('https://api.automatedinsights.com/v1.8/projects', body);
  return httpRequestBegin(`${global.aquiferOptions.wsApiUrl}/projects`, body);
}

export function httpRequestCreateProjectFromDataFile(name, file) {
  log.logRichMessages([
    { text: '☁️  ', style: log.style.emoji },
    { text: `Api use data file to create project: ${name}`, style: log.style.filler }], { withScreenshot: false });

  const httpRequestPromise = httpRequestCreateProjectFromDataFile_begin(name, file);
  httpRequestComplete(httpRequestPromise);
}
