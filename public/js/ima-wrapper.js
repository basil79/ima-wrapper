/*!
 * ima-wrapper v1.0.3 development
 * Updated : 2023-01-24
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

/***/ "./src/ima-wrapper.js":
/*!****************************!*\
  !*** ./src/ima-wrapper.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\n\nconst IMAWrapper = function(adContainer, videoElement, callback) {\n\n  this._adContainer = adContainer;\n  this._videoElement = videoElement;\n  this._callback = callback;\n\n  // Events\n  this.EVENTS = {\n    AdsManagerLoaded: 'AdsManagerLoaded', // After success ad request, when vast xml is parsed and ready\n    AdStarted: 'AdStarted',\n    AdStopped: 'AdStopped',\n    AdSkipped: 'AdSkipped',\n    AdLoaded: 'AdLoaded',\n    AdLinearChange: 'AdLinearChange',\n    AdSizeChange: 'AdSizeChange',\n    AdExpandedChange: 'AdExpandedChange',\n    AdSkippableStateChange: 'AdSkippableStateChange',\n    AdDurationChange: 'AdDurationChange',\n    AdRemainingTimeChange: 'AdRemainingTimeChange',\n    AdVolumeChange: 'AdVolumeChange',\n    AdImpression: 'AdImpression',\n    AdClickThru: 'AdClickThru',\n    AdInteraction: 'AdInteraction',\n    AdVideoStart: 'AdVideoStart',\n    AdVideoFirstQuartile: 'AdVideoFirstQuartile',\n    AdVideoMidpoint: 'AdVideoMidpoint',\n    AdVideoThirdQuartile: 'AdVideoThirdQuartile',\n    AdVideoComplete: 'AdVideoComplete',\n    AdUserAcceptInvitation: 'AdUserAcceptInvitation',\n    AdUserMinimize: 'AdUserMinimize',\n    AdUserClose: 'AdUserClose',\n    AdPaused: 'AdPaused',\n    AdPlaying: 'AdPlaying',\n    AdError: 'AdError',\n    AdLog: 'AdLog',\n    AllAdsCompleted: 'AllAdsCompleted' // After all ads completed, vast, vpaid, vmap\n  };\n  // An object containing all registered events.\n  // These events are all callbacks.\n  this._eventCallbacks = {};\n\n  // IMA global variables\n  this._adsLoader = null;\n  this._adDisplayContainer = null;\n  this._adDisplayContainerInitialized = false;\n  this._adsManager = null;\n  this._currentAd = null;\n  this._adPodInfo = null;\n\n  // Attributes\n  this._attributes = {\n    version: '1.0.3'\n  };\n\n  // Options\n  this._options = {\n    autoplay: true,\n    muted: true,\n    secure: false, // default false, google.ima.ImaSdkSettings.VpaidMode.INSECURE\n    vastLoadTimeout: 23000,\n    loadVideoTimeout: 8000, // default value is 8000 ms = 8 sec, timeout to load video of the ad\n  };\n\n  // IMA SDK ima3.js\n  this.IMA_SDK_SRC = '//imasdk.googleapis.com/js/sdkloader/ima3.js';\n  // Check that Client Side IMA SDK has been included\n  // NOTE: (window['google'] && google.ima) check for any\n  // IMA SDK, including SDK for Server Side ads.\n  // The 3rd check insures we have the right SDK:\n  // {google.ima.AdsLoader} is an object that's part of Client Side IMA SDK\n  // but not Server Side SDK.\n  if (!window['google'] || !google.ima || !google.ima.AdsLoader) {\n    console.log('ima3.js is not included');\n    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.loadScript)(this.IMA_SDK_SRC, true, (isIMALoaded, error) => {\n      if(isIMALoaded) {\n        console.log('ima3.js is loaded, setup IMA');\n        this.setupIMA();\n      } else {\n        console.log('ima3.js is not loaded');\n        if(this._callback\n          && typeof this._callback === 'function') {\n          this._callback('ima sdk not loaded');\n        }\n      }\n    });\n  } else {\n    console.log('ima3.js is included, use it');\n    this.setupIMA();\n  }\n\n};\nIMAWrapper.prototype.setupIMA = function() {\n  console.log('setup IMA');\n  google.ima.settings.setDisableCustomPlaybackForIOS10Plus(true);\n\n  this._adDisplayContainer = new google.ima.AdDisplayContainer(this._adContainer, this._videoElement);\n  this._adsLoader = new google.ima.AdsLoader(this._adDisplayContainer);\n\n  // Listen and respond to ads loaded and error events.\n  this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onIMAAdsManagerLoaded.bind(this), false);\n  this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onIMAAdsManagerAdError.bind(this), false);\n\n  if(this._callback\n    && typeof this._callback === 'function') {\n    this._callback();\n  }\n};\nIMAWrapper.prototype.doContentComplete = function() {\n  this._adsLoader && this._adsLoader.contentComplete();\n};\nIMAWrapper.prototype.maybeInitializeAdDisplayContainer = function() {\n  this._adDisplayContainerInitialized || (this._adDisplayContainer.initialize(), this._adDisplayContainerInitialized = true);\n};\nIMAWrapper.prototype.init = function(width, height, viewMode) {\n  console.log('ima init');\n  this.maybeInitializeAdDisplayContainer();\n  this._adsManager && this._adsManager.init(width, height, viewMode);\n};\nIMAWrapper.prototype.start = function() {\n  console.log('ima start');\n  this._adsManager && this._adsManager.start();\n};\nIMAWrapper.prototype.getDuration = function() {\n  return this._currentAd ? this._currentAd.getDuration() : -2\n};\nIMAWrapper.prototype.getRemainingTime = function() {\n  return this._adsManager ? this._adsManager.getRemainingTime() : -2\n};\nIMAWrapper.prototype.resume = function() {\n  this._adsManager && this._adsManager.resume();\n};\nIMAWrapper.prototype.pause = function() {\n  this._adsManager && this._adsManager.pause();\n};\nIMAWrapper.prototype.stop = function() {\n  this._adsManager && this._adsManager.stop();\n};\nIMAWrapper.prototype.skip = function() {\n  if(this._adsManager) {\n    if (this._adsManager.getAdSkippableState()) {\n      this._adsManager.skip();\n    }\n    // Force skip\n    this.onIMAAdSkipped();\n  }\n};\nIMAWrapper.prototype.resize = function(width, height, viewMode) {\n  this._adsManager && (this._adsManager.resize(width, height, viewMode), this.onAdSizeChange());\n};\nIMAWrapper.prototype.getVolume = function() {\n  return this._adsManager && this._adsManager.getVolume()\n};\nIMAWrapper.prototype.setVolume = function(volume) {\n  this._adsManager && this._adsManager.setVolume(volume);\n};\nIMAWrapper.prototype.getSkippableState = function() {\n  return this._adsManager && this._adsManager.getAdSkippableState();\n};\nIMAWrapper.prototype.collapse = function() {\n  this._adsManager && this._adsManager.collapse();\n};\nIMAWrapper.prototype.expand = function() {\n  this._adsManager && this._adsManager.expand();\n};\nIMAWrapper.prototype.requestAds = function(vastUrl, options) {\n\n  console.log('ima requestAds', this._adsLoader);\n\n  // Assign options\n  Object.assign(this._options, options);\n\n  // Create adsRequest\n  const adsRequest = new google.ima.AdsRequest();\n  // Check if vastUrl is URL\n  let isURL = false;\n  try {\n    new URL(vastUrl);\n    isURL = true;\n  } catch (e) {}\n\n  // Use VAST URL or VAST XML\n  isURL ? adsRequest.adTagUrl = vastUrl : adsRequest.adsResponse = vastUrl;\n\n  // Get/Set options\n  this._options.pageUrl && (adsRequest.pageUrl = this._options.pageUrl);\n\n  adsRequest.vastLoadTimeout = this._options.vastLoadTimeout;\n\n  adsRequest.linearAdSlotWidth = this._videoElement.width;\n  adsRequest.linearAdSlotHeight = this._videoElement.height;\n  adsRequest.nonLinearAdSlotWidth = this._videoElement.width;\n  adsRequest.nonLinearAdSlotHeight = this._videoElement.height;\n\n  adsRequest.setAdWillAutoPlay(this._options.autoplay);\n  console.log('ima ad will play muted', this._options.muted);\n  if(this._options.muted) {\n    adsRequest.setAdWillPlayMuted(this._options.muted);\n  }\n\n  this._adsLoader.getSettings().setVpaidMode(this._options.secure ?\n    google.ima.ImaSdkSettings.VpaidMode.ENABLED :\n    google.ima.ImaSdkSettings.VpaidMode.INSECURE\n  );\n  // Request ads\n  this._adsLoader.requestAds(adsRequest);\n};\nIMAWrapper.prototype.abort = function() {\n  console.log('ima destroy adsManager');\n  // Destroy\n  this._adsManager && (this._adsManager.destroy(), this._adsManager = null);\n  this.doContentComplete();\n};\n\n// IMA Events\nIMAWrapper.prototype.onIMAAdsManagerLoaded = function(adsManagerLoadedEvent) {\n\n  console.log('ima adsManager loaded');\n\n  const adsRenderingSettings = new google.ima.AdsRenderingSettings;\n  adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;\n  adsRenderingSettings.loadVideoTimeout = this._options.loadVideoTimeout;\n\n  this._adsManager = adsManagerLoadedEvent.getAdsManager(this._videoElement, adsRenderingSettings);\n\n  this._adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onIMAAdError.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.AD_BREAK_READY, function() {});\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.AD_METADATA, function() {});\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, this.onAllAdsCompleted.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, this.onIMAAdClickThru.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.onIMAAdVideoComplete.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onAdStarted.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onAdStopped.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.DURATION_CHANGE, this.onAdDurationChange.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE, this.onAdVideoFirstQuartile.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.IMPRESSION, this.onAdImpression.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.INTERACTION, this.onAdInteraction.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.LINEAR_CHANGED, this.onAdLinearChange.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, this.onIMAAdLoaded.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.LOG, this.onIMAAdLog.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT, this.onAdVideoMidpoint.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, this.onAdPaused.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, this.onAdPlaying.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED, this.onAdSkippableStateChange.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, this.onIMAAdSkipped.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, this.onAdVideoStart.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE, this.onAdVideoThirdQuartile.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.USER_CLOSE, this.onAdUserClose.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, this.onAdVolumeChange.bind(this));\n  this._adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, this.onAdVolumeChange.bind(this));\n\n  this.onAdsManagerLoaded();\n};\nIMAWrapper.prototype.onIMAAdsManagerAdError = function(adsManagerAdErrorEvent) {\n  this.abort();\n  this.onAdError(adsManagerAdErrorEvent.getError()); //.getError().getErrorCode() + ' ' + adsManagerAdErrorEvent.getError().getMessage());\n};\nIMAWrapper.prototype.onIMAAdClickThru = function(adEvent) {\n  this.onAdClickThru('', adEvent.getAd().getAdId(), false);\n};\nIMAWrapper.prototype.onIMAAdVideoComplete = function() {\n  this.onAdVideoComplete();\n};\nIMAWrapper.prototype.onIMAAdLoaded = function(adEvent) {\n  this._currentAd = adEvent.getAd();\n  this.onAdLoaded(this._currentAd);\n};\nIMAWrapper.prototype.onIMAAdSkipped = function() {\n  // Destroy ad\n  this.abort();\n  this.onAdSkipped();\n  this.onAdStopped();\n};\nIMAWrapper.prototype.onIMAAdError = function(adErrorEvent) {\n  this.abort();\n  console.log('ima error', adErrorEvent);\n  this.onAdError(adErrorEvent.getError()); //.getError().getErrorCode() + ' ' + adErrorEvent.getError().getMessage() + ' ' + adErrorEvent.getError().getInnerError())\n};\nIMAWrapper.prototype.onIMAAdLog = function(adEvent) {\n  (adEvent = adEvent.getAdData()).hasOwnProperty('adError') ? this.onAdLog(adEvent.adError.getMessage()) : this.onAdLog('IMA Ad Log');\n};\n\n// Events\nIMAWrapper.prototype.onAdsManagerLoaded = function() {\n  this._callEvent(this.EVENTS.AdsManagerLoaded);\n};\nIMAWrapper.prototype.onAdLoaded = function(currentAd) {\n  if (this.EVENTS.AdLoaded in this._eventCallbacks) {\n    this._eventCallbacks[this.EVENTS.AdLoaded](currentAd);\n  }\n};\nIMAWrapper.prototype.onAdStarted = function() {\n  this._callEvent(this.EVENTS.AdStarted);\n};\nIMAWrapper.prototype.onAdDurationChange = function() {\n  this._callEvent(this.EVENTS.AdDurationChange);\n};\nIMAWrapper.prototype.onAdLinearChange = function() {\n  this._callEvent(this.EVENTS.AdLinearChange);\n};\nIMAWrapper.prototype.onAdSkippableStateChange = function() {\n  this._callEvent(this.EVENTS.AdSkippableStateChange);\n};\nIMAWrapper.prototype.onAdSizeChange = function() {\n  this._callEvent(this.EVENTS.AdSizeChange);\n};\nIMAWrapper.prototype.onAdVolumeChange = function() {\n  this._callEvent(this.EVENTS.AdVolumeChange);\n};\nIMAWrapper.prototype.onAdVideoStart = function() {\n  this._callEvent(this.EVENTS.AdVideoStart);\n};\nIMAWrapper.prototype.onAdImpression = function() {\n  this._callEvent(this.EVENTS.AdImpression);\n};\nIMAWrapper.prototype.onAdVideoFirstQuartile = function() {\n  this._callEvent(this.EVENTS.AdVideoFirstQuartile);\n};\nIMAWrapper.prototype.onAdVideoMidpoint = function() {\n  this._callEvent(this.EVENTS.AdVideoMidpoint);\n};\nIMAWrapper.prototype.onAdVideoThirdQuartile = function() {\n  this._callEvent(this.EVENTS.AdVideoThirdQuartile);\n};\nIMAWrapper.prototype.onAdVideoComplete = function() {\n  this._callEvent(this.EVENTS.AdVideoComplete);\n};\nIMAWrapper.prototype.onAdPaused = function() {\n  this._callEvent(this.EVENTS.AdPaused);\n};\nIMAWrapper.prototype.onAdPlaying = function() {\n  this._callEvent(this.EVENTS.AdPlaying);\n};\nIMAWrapper.prototype.onAdSkipped = function() {\n  this._callEvent(this.EVENTS.AdSkipped);\n};\nIMAWrapper.prototype.onAdStopped = function() {\n  this._callEvent(this.EVENTS.AdStopped);\n};\nIMAWrapper.prototype.onAdClickThru = function(url, id, playerHandles) {\n  if (this.EVENTS.AdClickThru in this._eventCallbacks) {\n    this._eventCallbacks[this.EVENTS.AdClickThru](url, id, playerHandles);\n  }\n};\nIMAWrapper.prototype.onAdInteraction = function() {\n  this._callEvent(this.EVENTS.AdInteraction);\n};\nIMAWrapper.prototype.onAdUserClose = function() {\n  this._callEvent(this.EVENTS.AdUserClose);\n};\nIMAWrapper.prototype.onAllAdsCompleted = function() {\n  this.abort();\n  this._callEvent(this.EVENTS.AllAdsCompleted);\n};\nIMAWrapper.prototype.onAdError = function(message) {\n  if (this.EVENTS.AdError in this._eventCallbacks) {\n    this._eventCallbacks[this.EVENTS.AdError](message);\n  }\n};\nIMAWrapper.prototype.onAdLog = function(message) {\n  if (this.EVENTS.AdLog in this._eventCallbacks) {\n    this._eventCallbacks[this.EVENTS.AdLog](message);\n  }\n};\nIMAWrapper.prototype._callEvent = function(eventName) {\n  if(eventName in this._eventCallbacks) {\n    this._eventCallbacks[eventName]();\n  }\n};\nIMAWrapper.prototype.addEventListener = function(eventName, callback, context) {\n  const givenCallback = callback.bind(context);\n  this._eventCallbacks[eventName] = givenCallback;\n};\nIMAWrapper.prototype.removeEventListener = function(eventName) {\n  this._eventCallbacks[eventName] = null;\n};\nIMAWrapper.prototype.getVersion = function() {\n  return this._attributes.version;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IMAWrapper);\n\n\n//# sourceURL=webpack://adserve/./src/ima-wrapper.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"tv\": () => (/* binding */ tv)\n/* harmony export */ });\n/* harmony import */ var _ima_wrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ima-wrapper */ \"./src/ima-wrapper.js\");\n\n\nconst tv = {\n  IMAWrapper: _ima_wrapper__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n}\n\n\n\n\n//# sourceURL=webpack://adserve/./src/index.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"loadScript\": () => (/* binding */ loadScript)\n/* harmony export */ });\nfunction loadScript(src, async = false, callback) {\n  const firstElement = document.getElementsByTagName('head')[0] || document.documentElement,\n    scriptElement = document.createElement('script');\n  scriptElement.type = 'text/javascript';\n  scriptElement.src = src;\n  scriptElement.async = async;\n  scriptElement.addEventListener('load', function() {\n    if(callback && typeof callback === 'function') {\n      callback(true, window);\n    }\n  }, false);\n  scriptElement.addEventListener('error', function(error) {\n    firstElement.removeChild(scriptElement);\n    if(callback && typeof callback === 'function') {\n      callback(false, error);\n    }\n  }, false);\n  firstElement.insertBefore(scriptElement, firstElement.firstChild);\n}\n\n\n\n\n//# sourceURL=webpack://adserve/./src/utils.js?");

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