import AdError from './ad-error';
import {AdsManager} from 'ads-manager';
import IMAWrapper from './ima-wrapper';

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
  // An object containing all registered events.
  // These events are all callbacks.
  this._eventCallbacks = {};

  this._adsManager = new AdsManager(this._adContainer);
  console.log('AdsManager version is', this._adsManager.getVersion());
  this._adsManager.addEventListener(this.EVENTS.AdsManagerLoaded, this.onAdsManagerLoaded.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdError, this.onAdError.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdLoaded, this.onAdLoaded.bind(this));


  this._imaWrapper = new IMAWrapper(this._adContainer, this._videoElement);
  this._imaWrapper.addEventListener(this.EVENTS.AdsManagerLoaded, this.onAdsManagerLoaded.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdError, this.onAdError.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdLoaded, this.onAdLoaded.bind(this));

  this._useIMA = false;

};
VideoAdManagerIMAWrapper.prototype.init = function(width, height, viewMode) {
  console.log('init', width, height, viewMode);
  this._useIMA ? this._imaWrapper.init(width, height, viewMode) : this._adsManager.init(width, height, viewMode);
};
VideoAdManagerIMAWrapper.prototype.abort = function() {
  this._useIMA ? this._imaWrapper.abort() : this._adsManager.abort();
};
VideoAdManagerIMAWrapper.prototype.resize = function(width, height, viewMode) {
  this._useIMA ? this._imaWrapper.resize(width, height, viewMode) : this._adsManager.resize(width, height, viewMode);
};
VideoAdManagerIMAWrapper.prototype.requestAds = function(vastUrl, options = {}) {
  console.log('request ads', vastUrl);
  this.abort();
  if(vastUrl && typeof vastUrl === 'string') {
    // Check if vast url contains pubads.g.doubleclick.net
    vastUrl.indexOf('pubads.g.doubleclick.net') !== -1 ? this._useIMA = true : this._useIMA = false;
    console.log('use IMA', this._useIMA);
    this._useIMA ? this._imaWrapper.requestAds(vastUrl, options) : this._adsManager.requestAds(vastUrl, options);
  } else {
    this.onAdError('VAST URL/XML is empty');
  }
};
// Events
VideoAdManagerIMAWrapper.prototype.onAdsManagerLoaded = function() {
  console.log('on AdsManagerLoaded');
  if (this.EVENTS.AdsManagerLoaded in this._eventCallbacks) {
    if(typeof this._eventCallbacks[this.EVENTS.AdsManagerLoaded] === 'function') {
      this._eventCallbacks[this.EVENTS.AdsManagerLoaded]();
    }
  }
};
VideoAdManagerIMAWrapper.prototype.onAdError = function(message) {
  if (this.EVENTS.AdError in this._eventCallbacks) {
    if(typeof this._eventCallbacks[this.EVENTS.AdError] === 'function') {
      this._eventCallbacks[this.EVENTS.AdError](typeof message !== 'object' ? new AdError(message) : message);
    }
  }
};
VideoAdManagerIMAWrapper.prototype.onAdLoaded = function(event) {
  if (this.EVENTS.AdLoaded in this._eventCallbacks) {
    if(typeof this._eventCallbacks[this.EVENTS.AdLoaded] === 'function') {
      this._eventCallbacks[this.EVENTS.AdLoaded](event);
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
