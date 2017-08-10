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
/***/ (function(module, exports) {

// borrowed from cmake-docs/Utilities/Sphinx/version-switch.js
(function() {
  'use strict';

  var url_re = /Doc\/(Nightly|(v\d\.\d))\//;
  var all_versions = {
    'Nightly': 'latest nightly',
    'v5.4': '5.4',
  };

  function build_select(current_version, current_release) {
    var buf = ['<select>'];

    Object.keys(all_versions).forEach(function(version) {
      var title = all_versions[version];
      buf.push('<option value="' + version + '"');
      if (version == current_version) {
        buf.push(' selected="selected">');
        if (version[0] == 'v') {
          buf.push(current_release);
        } else {
          buf.push(title + ' (' + current_release + ')');
        }
      } else {
        buf.push('>' + title);
      }
      buf.push('</option>');
    });

    buf.push('</select>');
    return buf.join('');
  }

  function patch_url(url, new_version) {
    return url.replace(url_re, 'Doc/' + new_version + '/');
  }

  function on_switch() {
    var selected = $(this).children('option:selected').attr('value');

    var url = window.location.href,
        new_url = patch_url(url, selected);

    if (new_url != url) {
      // check beforehand if url exists, else redirect to version's start page
      $.ajax({
        url: new_url,
        success: function() {
           window.location.href = new_url;
        },
        error: function() {
           window.location.href = 'https://www.paraview.org/ParaView/Doc/' + selected;
        }
      });
    }
  }

  $(document).ready(function() {
    var match = url_re.exec(window.location.href);
    if (match) {
      // set by Sphinx in generated documentation:
      var release = DOCUMENTATION_OPTIONS.VERSION;
      var version = match[1];
      var select = build_select(version, release);
      $('.wy-side-nav-search li.version').html(select);
      $('.wy-side-nav-search li.version select').bind('change', on_switch);
    }
  });
})();


/***/ })
/******/ ]);