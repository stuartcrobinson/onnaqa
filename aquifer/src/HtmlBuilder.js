// @ts-check
import { AllHtmlEntities } from 'html-entities';

const entities = new AllHtmlEntities();


export const html = {

  link(classValue, text) {
    return `<span class="${classValue}"><a href=${text}>${entities.encode(text)}</a></span>`;
  },

  text(classValue, text) {
    return `<span class="${classValue}">${entities.encode(text)}</span>`;
  },

  dblclickableSelector(classValue, text) {
    return `
<span class="${classValue} monospace;"  ondblclick="dblclickSelectorSpan(this);">
    <span class='selector-text'>${entities.encode(text)}</span>
    <input onblur="blurSelectorInput(this);" type='text'  value='${entities.encode(text)}'>
</span>`;
  },

  pageInitialize(specFileTestlessName, doSaveEventScreenshots, relativeSpecFilePath) {
    return `
    <!doctype html>
      <head>
        <title>${specFileTestlessName} - aquifer</title>
        <link rel="icon" href="icon/favicon.png" type="image/x-icon">
      </head>
      <style>
        body {
          background-color: #f5f5f5
        }
        a:link {
          color: inherit;
        }
        a:visited {
          color: inherit;
        }
        a:hover {
          color: inherit;
        }
        a:active {
          color: inherit;
        }
        a:link {
          text-decoration: none;
        }
        a:visited {
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .selector-text:hover {
          color: darkgray;
          background-color: azure !important;
        }
        .header img {
          padding-left: 10px;
          float: left;
          width: 50px;
          height: 50px;
        }
        .header h1 {
          position: relative;
          top: 8px;
          left: 10px;
        }
        .monospace {font-family: monospace;}
        input {display:none;font-family:inherit;font-size:inherit;height:12px;margin-left:-3px;margin-right:-4px;}
        .red {color:red;}
        .green {color:green;}
        .blue {color:blue;}
        .gray {color:#C8C8C8;}
        .bold {font-weight:bold;}
        .italic {font-style:italic;}
        .bold {font-weight:bold;}
        .gray {color:#C8C8C8;}
        .emoji {font-size:11px;}
        .gray {color:#C8C8C8;}
        .whitespace {white-space:pre;}
        #eventImage {position:fixed;bottom:0;right:0;width:45%;border:1px solid blue;}
      </style>

      <script>
        function dblclickSelectorSpan(e) {
          e.firstElementChild.style.display = 'none';
          e.lastElementChild.style.width = ((e.lastElementChild.value.length) * 8) + 'px';
          e.lastElementChild.style.display = 'inline';
          // e.lastElementChild.focus();
          e.lastElementChild.select();
        }
        function blurSelectorInput(e) {
          e.style.display = 'none';
          e.parentElement.firstElementChild.style.display = 'inline';
        }


        function logEntryMouseover(screenshotId, eventScreenshotFileRelPath) {
          var elements = document.getElementsByClassName('logline');
          for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor="inherit"; //to undo highlighting of prev log line
          }
          ${doSaveEventScreenshots ? 'document.images["eventImage"].src=eventScreenshotFileRelPath;' : ''}
          document.getElementById('entrySpan'+screenshotId).style.backgroundColor="white";
        }
      </script>
      ${doSaveEventScreenshots ? '<img src="" id="eventImage"/>' : ''}
      
      <div class="header">
        <img src="icon/icon.svg" alt="logo" />
        <h1>${relativeSpecFilePath}</h1>
      </div>
      `;
  },
};
