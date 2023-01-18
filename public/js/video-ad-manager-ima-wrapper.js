/*!
 * video-ad-manager-ima-wrapper v1.0.0 development
 * Updated : 2023-01-18
 */
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var adserve;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"tv\": () => (/* binding */ tv)\n/* harmony export */ });\n/* harmony import */ var _video_ad_manager_ima_wrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./video-ad-manager-ima-wrapper */ \"./src/video-ad-manager-ima-wrapper.js\");\n\n\nconst tv = {\n  VideoAdManagerIMAWrapper: _video_ad_manager_ima_wrapper__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n}\n\n\n\n\n//# sourceURL=webpack://adserve/./src/index.js?");

/***/ }),

/***/ "./src/video-ad-manager-ima-wrapper.js":
/*!*********************************************!*\
  !*** ./src/video-ad-manager-ima-wrapper.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst VideoAdManagerIMAWrapper = function(adContainer, videoElement) {\n\n  if(!(adContainer instanceof Element || adContainer instanceof HTMLDocument) || !(videoElement instanceof Element || videoElement instanceof HTMLDocument)) {\n    throw new Error('ad container and/or video element are not defined');\n  }\n\n  this._adContainer = null;\n  this._videoElement = null;\n\n  this._attributes = {\n    width: 300,\n    height: 154,\n    viewMode: 'normal',\n    volume: 0,\n    version: '1.0.0'\n  };\n  this._eventCallbacks = {};\n\n  this.IMA_SDK_URL = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';\n\n  this._adsManager = null; // TODO\n  this._imaManager = null; // TODO\n\n\n  this.initAdsManager();\n  this.initIMAManager();\n\n};\nVideoAdManagerIMAWrapper.prototype.init = function(width, height, viewMode) {\n  console.log('init');\n};\n// TODO:\nVideoAdManagerIMAWrapper.prototype.initAdsManager = function() {\n  console.log('init ads manager');\n};\nVideoAdManagerIMAWrapper.prototype.initIMAManager = function() {\n  console.log('init ima');\n  // Check that Client Side IMA SDK has been included\n  // NOTE: (window['google'] && google.ima) check for any\n  // IMA SDK, including SDK for Server Side ads.\n  // The 3rd check insures we have the right SDK:\n  // {google.ima.AdsLoader} is an object that's part of Client Side IMA SDK\n  // but not Server Side SDK.\n  if (!window['google'] || !google.ima || !google.ima.AdsLoader) {\n    console.log('ima3.js is not included');\n  } else {\n    console.log('ima3.js is included, use it');\n  }\n};\n\nVideoAdManagerIMAWrapper.prototype.requestAds = function(vastUrl, options = {}) {\n  console.log('request ads', vastUrl);\n};\nVideoAdManagerIMAWrapper.prototype.resize = function(width, height, viewMode) {\n  // TODO:\n};\nVideoAdManagerIMAWrapper.prototype.addEventListener = function(eventName, callback, context) {\n  const givenCallback = callback.bind(context);\n  this._eventCallbacks[eventName] = givenCallback;\n};\nVideoAdManagerIMAWrapper.prototype.removeEventListener = function(eventName) {\n  this._eventCallbacks[eventName] = null;\n};\nVideoAdManagerIMAWrapper.removeEventListeners = function(eventCallbacks) {\n  for (const eventName in eventCallbacks) {\n    eventCallbacks.hasOwnProperty(eventName) && this.removeEventListener(eventName);\n  }\n};\nVideoAdManagerIMAWrapper.prototype.getVersion = function() {\n  return this._attributes.version;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VideoAdManagerIMAWrapper);\n\n\n//# sourceURL=webpack://adserve/./src/video-ad-manager-ima-wrapper.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	adserve = __webpack_exports__;
/******/ 	
/******/ })()
;