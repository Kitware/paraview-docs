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
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["PV"] = __webpack_require__(2);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDropDown = updateDropDown;
var urlRegExp = /paraview-docs\/([^\/]+)\/(cxx|python)\//;
var langageMap = { python: "cxx", cxx: "python" };

// ----------------------------------------------------------------------------

function fetchText(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.response);
        } else {
          reject(xhr, e);
        }
      }
    };

    // Make request
    xhr.open("GET", url, true);
    xhr.responseType = "text";
    xhr.send();
  });
}

// ----------------------------------------------------------------------------

function buildDropDown(versions, active, otherLang) {
  var buf = ["<select>"];
  versions.forEach(function (version) {
    buf.push("<option value=\"" + version + "\" " + (version == active ? 'selected="selected"' : "") + ">" + version + "</option>");
  });
  buf.push("</select>");
  buf.push("<a href=\"/paraview-docs/" + active + "/" + otherLang + "\" style=\"display: inline-block; margin-left: 10px; color: black;\">Go to " + otherLang + " documentation</a>");
  return buf.join("");
}

// ----------------------------------------------------------------------------

function patchURL(url, new_version, new_lang) {
  var lang = new_lang || urlRegExp.exec(window.location.href)[3];
  return url.replace(urlRegExp, "paraview-docs/" + new_version + "/" + lang + "/");
}

// ----------------------------------------------------------------------------

function onSwitch(event) {
  var selected = event.target.value;
  var url = window.location.href;
  var newURL = patchURL(url, selected);

  if (newURL != url) {
    window.location.href = newURL;
  }
}

// ----------------------------------------------------------------------------

function updateDropDown() {
  fetchText("/paraview-docs/versions").then(function (txt) {
    console.log("fetchText");
    var versions = txt.split("\n").filter(function (str) {
      return str.length;
    });
    versions.sort();
    console.log(versions);
    var match = urlRegExp.exec(window.location.href);
    console.log(match);
    if (match) {
      var lang = match[3];
      var otherLang = langageMap[lang] || "cxx";
      var activeVersion = match[1];
      var selectHTML = buildDropDown(versions, activeVersion, otherLang);
      if (lang === "python") {
        var container = document.querySelector(".wy-side-nav-search li.version");
        container.innerHTML = selectHTML;
        container.querySelector("select").addEventListener("change", onSwitch);
      } else if (lang === "cxx") {
        // create a div, add to header
        var projectContainer = document.querySelector("#projectname");
        var selectContainer = document.createElement("div");
        selectContainer.setAttribute("class", "versionSwitch");
        selectContainer.setAttribute("style", "display: inline-flex; align-items: center; margin-left: 15px;");
        selectContainer.innerHTML = selectHTML;

        projectContainer.appendChild(selectContainer);
        selectContainer.querySelector("select").addEventListener("change", onSwitch);
      }
    }
  });
}

setTimeout(updateDropDown, 500);

/***/ })
/******/ ]);