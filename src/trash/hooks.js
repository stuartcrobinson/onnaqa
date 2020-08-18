import { assert } from 'chai';
import {
  httpRequestCreateProjectFromDataObject, httpRequestCreateProjectFromDataFile,
} from './ApiStuff';
import { editorPage } from './ui-model/wordsmith/editor/editor.page';
import { galleryCityGuideNarrative as galleryProjectNarrative } from './ui-model/wordsmith/misc/page/galleryNarrative.page';
import { loginPage } from './ui-model/wordsmith/misc/page/login.page';
import { projectPage } from './ui-model/wordsmith/misc/page/project.page';
import * as tools from './tools';
import { galleryPage } from './ui-model/wordsmith/misc/page/gallery.page';

export const defaultDataForApi = [{
  string: 'anneau du Vic-Bilh',
  num: 100,
  list: 'one,Two,tHREE',
  bool: 'true',
  date: '2/1/1900',
  time: '1:45:12 PM',
}];


/**
 * "Before"-level hooks.  Named by the page on which the functions end.
 */
export class Load {
  static dashboard() {
    loginPage.logIn();
  }

  static projectTemplateFromGallery(projectName) {
    galleryPage.load();
    galleryPage.getProjectCard(projectName).click_waitForNotExisting();
    galleryProjectNarrative.theGetProjectButton.click_waitForNotExisting({ timeout: 120000 }); // this can take a while, especially in parallel
    projectPage.getNthTemplateLink(1).click_waitForNotExisting();
  }

  static newTemplateEditor(data = defaultDataForApi, label = undefined) {
    const projectName = tools.newProjectName(label);

    if (global.aquiferOptions.wsApiKey) {
      httpRequestCreateProjectFromDataObject(projectName, data);
    }

    loginPage.logIn({ failsafe: true });

    if (!global.aquiferOptions.wsApiKey) {
      httpRequestCreateProjectFromDataObject(projectName, data);
    }

    projectPage
      .setUrl(tools.getProjectUrlFromName(projectName))
      .loadWithRetry(40000);

    projectPage.createNewTemplateButton.click_waitForNotExisting();
    assert(editorPage.isLoaded(), 'Template editor page should be loaded.');
  }


  static newTemplateEditorUsingDataFile(file, label = undefined) {
    const projectName = tools.newProjectName(label);


    // TODO use endpoint to get apikey !!!

    if (global.aquiferOptions.wsApiKey) {
      httpRequestCreateProjectFromDataFile(projectName, file);
    }

    loginPage.logIn({ failsafe: true });

    if (!global.aquiferOptions.wsApiKey) {
      httpRequestCreateProjectFromDataFile(projectName, file);
    }

    projectPage.setUrl(tools.getProjectUrlFromName(projectName)).loadWithRetry();
    projectPage.createNewTemplateButton.click_waitForNotExisting();
    assert(editorPage.isLoaded(), 'Template editor page should be loaded.');
  }
}
