/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);


const urlRegExp = /paraview-docs\/(nightly|(v\d\.\d))\/(cxx|python)\//;
let flavor = 'cxx';

// ----------------------------------------------------------------------------

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.response);
        } else {
          reject(xhr, e);
        }
      }
    };

    // Make request
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.send();
  });
}

// ----------------------------------------------------------------------------

function buildDropDown(versions, active) {
  var buf = ['<select>'];
  versions.forEach(function(version) {
    buf.push(`<option value="${version}" ${version == active ? 'selected="selected"' : ''}>${version}</option>`);
  });
  buf.push('</select>');
  return buf.join('');
}

// ----------------------------------------------------------------------------

function patchURL(url, new_version) {
  return url.replace(urlRegExp, `paraview-docs/${new_version}/${flavor}/`);
}

// ----------------------------------------------------------------------------

function onSwitch(event) {
  var selected = event.target.value;
  var url = window.location.href;
  const newURL = patchURL(url, selected);

  if (newURL != url) {
    window.location.href = newURL;
  }
}

// ----------------------------------------------------------------------------

fetchText('/paraview-docs/versions')
  .then(
    (txt) => {
      console.log('fetchText');
      const versions = txt.split('\n').filter(str => str.length);
      versions.sort();
      const match = urlRegExp.exec(window.location.href);
      if (match) {
        flavor = match[3];
        const activeVersion = match[1];
        var selectHTML = buildDropDown(versions, activeVersion);
        if (flavor === 'python') {
          const container = document.querySelector('.wy-side-nav-search li.version');
          container.innerHTML = selectHTML;
          container.querySelector('select').addEventListener('change', onSwitch);
        } else if (flavor === 'cxx') {
          // create a div, add to header
          var selectContainer = __WEBPACK_IMPORTED_MODULE_0_jquery___default()('<div/>', {
            class: 'versionSwitch',
            css: {
              display: "inline-block",
              "margin-left": "15px",
            }
          });

          selectContainer.appendTo('#projectname');
          selectContainer.append(selectHTML);
          document.querySelector('#projectname select').addEventListener('change', onSwitch);
        }
      } else {
        console.log('no match');
      }
    });

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })
/******/ ]);