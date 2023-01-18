import {loadScript} from './utils';
import AdError from './ad-error';
import {AdsManager} from 'ads-manager';

const VideoAdManagerIMAWrapper = function(adContainer, videoElement) {

  if(!(adContainer instanceof Element || adContainer instanceof HTMLDocument)
    || !(videoElement instanceof Element || videoElement instanceof HTMLDocument)) {
    throw new Error('ad container and/or video element not defined');
  }

  this._adContainer = adContainer;
  this._videoElement = videoElement;

  this._attributes = {
    width: 300,
    height: 154,
    viewMode: 'normal',
    volume: 0,
    version: '!!#Version#!!'
  };

  // Events
  this.EVENTS = {
    AdsManagerLoaded: 'AdsManagerLoaded', // After success ad request, when vast xml is parsed and ready
    AdStarted: 'AdStarted',
    AdStopped: 'AdStopped',
    AdSkipped: 'AdSkipped',
    AdLoaded: 'AdLoaded',
    AdLinearChange: 'AdLinearChange',
    AdSizeChange: 'AdSizeChange',
    AdExpandedChange: 'AdExpandedChange',
    AdSkippableStateChange: 'AdSkippableStateChange',
    AdDurationChange: 'AdDurationChange',
    AdRemainingTimeChange: 'AdRemainingTimeChange',
    AdVolumeChange: 'AdVolumeChange',
    AdImpression: 'AdImpression',
    AdClickThru: 'AdClickThru',
    AdInteraction: 'AdInteraction',
    AdVideoStart: 'AdVideoStart',
    AdVideoFirstQuartile: 'AdVideoFirstQuartile',
    AdVideoMidpoint: 'AdVideoMidpoint',
    AdVideoThirdQuartile: 'AdVideoThirdQuartile',
    AdVideoComplete: 'AdVideoComplete',
    AdUserAcceptInvitation: 'AdUserAcceptInvitation',
    AdUserMinimize: 'AdUserMinimize',
    AdUserClose: 'AdUserClose',
    AdPaused: 'AdPaused',
    AdPlaying: 'AdPlaying',
    AdError: 'AdError',
    AdLog: 'AdLog',
    AllAdsCompleted: 'AllAdsCompleted' // After all ads completed, vast, vpaid, vmap
  };
  this._eventCallbacks = {};

  // IMA SDK ima3.js
  this.IMA_SDK_SRC = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
  // Check that Client Side IMA SDK has been included
  // NOTE: (window['google'] && google.ima) check for any
  // IMA SDK, including SDK for Server Side ads.
  // The 3rd check insures we have the right SDK:
  // {google.ima.AdsLoader} is an object that's part of Client Side IMA SDK
  // but not Server Side SDK.
  if (!window['google'] || !google.ima || !google.ima.AdsLoader) {
    console.log('ima3.js is not included');
    loadScript(this.IMA_SDK_SRC, true, (isIMALoaded) => {
      if(isIMALoaded) {
        console.log('ima3.js is loaded, setup IMA');
        // TODO: setup
      } else {
        //this.onAdError('IMA SDK is not loaded');
        console.log('ima3.js is not loaded');
      }
    });
  } else {
    console.log('ima3.js is included, use it');
    // TODO: setup
  }

  this._adsManager = new AdsManager(this._adContainer);
  console.log('AdsManager version is', this._adsManager.getVersion());
  this._imaManager = null; // TODO

  this._useIMA = false;

};
VideoAdManagerIMAWrapper.prototype.init = function(width, height, viewMode) {
  console.log('init');
};
VideoAdManagerIMAWrapper.prototype.requestAds = function(vastUrl, options = {}) {
  console.log('request ads', vastUrl);
  // Check if vast url contains pubads.g.doubleclick.net
  vastUrl.indexOf('pubads.g.doubleclick.net') !== -1 ? this._useIMA = true : this._useIMA = false;

  console.log('use IMA', this._useIMA);
};
VideoAdManagerIMAWrapper.prototype.resize = function(width, height, viewMode) {
  // TODO:
};
// Events
VideoAdManagerIMAWrapper.prototype.onAdError = function(message) {
  if (this.EVENTS.AdError in this._eventCallbacks) {
    if(typeof this._eventCallbacks[this.EVENTS.AdError] === 'function') {
      this._eventCallbacks[this.EVENTS.AdError](typeof message !== 'object' ? new AdError(message) : message);
    }
  }
};

VideoAdManagerIMAWrapper.prototype.addEventListener = function(eventName, callback, context) {
  const givenCallback = callback.bind(context);
  this._eventCallbacks[eventName] = givenCallback;
};
VideoAdManagerIMAWrapper.prototype.removeEventListener = function(eventName) {
  this._eventCallbacks[eventName] = null;
};
VideoAdManagerIMAWrapper.removeEventListeners = function(eventCallbacks) {
  for (const eventName in eventCallbacks) {
    eventCallbacks.hasOwnProperty(eventName) && this.removeEventListener(eventName);
  }
};
VideoAdManagerIMAWrapper.prototype.getVersion = function() {
  return this._attributes.version;
};

export default VideoAdManagerIMAWrapper;
