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
  this._adsManager.addEventListener(this.EVENTS.AdLog, this.onAdLog.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdLoaded, this.onAdLoaded.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdStarted, this.onAdStarted.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdDurationChange, this.onAdDurationChange.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdLinearChange, this.onAdLinearChange.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdSkippableStateChange, this.onAdSkippableStateChange.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdSizeChange, this.onAdSizeChange.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdVolumeChange, this.onAdVolumeChange.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdVideoStart, this.onAdVideoStart.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdImpression, this.onAdImpression.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdVideoFirstQuartile, this.onAdVideoFirstQuartile.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdVideoMidpoint, this.onAdVideoMidpoint.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdVideoThirdQuartile, this.onAdVideoThirdQuartile.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdVideoComplete, this.onAdVideoComplete.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdPaused, this.onAdPaused.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdPlaying, this.onAdPlaying.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdSkipped, this.onAdSkipped.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdStopped, this.onAdStopped.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AdClickThru, this.onAdClickThru.bind(this));
  this._adsManager.addEventListener(this.EVENTS.AllAdsCompleted, this.onAllAdsCompleted.bind(this));


  this._imaWrapper = new IMAWrapper(this._adContainer, this._videoElement);
  this._imaWrapper.addEventListener(this.EVENTS.AdsManagerLoaded, this.onAdsManagerLoaded.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdLog, this.onAdLog.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdError, this.onAdError.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdLoaded, this.onAdLoaded.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdStarted, this.onAdStarted.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdDurationChange, this.onAdDurationChange.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdLinearChange, this.onAdLinearChange.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdSkippableStateChange, this.onAdSkippableStateChange.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdSizeChange, this.onAdSizeChange.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdVolumeChange, this.onAdVolumeChange.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdVideoStart, this.onAdVideoStart.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdImpression, this.onAdImpression.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdVideoFirstQuartile, this.onAdVideoFirstQuartile.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdVideoMidpoint, this.onAdVideoMidpoint.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdVideoThirdQuartile, this.onAdVideoThirdQuartile.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdVideoComplete, this.onAdVideoComplete.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdPaused, this.onAdPaused.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdPlaying, this.onAdPlaying.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdSkipped, this.onAdSkipped.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdStopped, this.onAdStopped.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AdClickThru, this.onAdClickThru.bind(this));
  this._imaWrapper.addEventListener(this.EVENTS.AllAdsCompleted, this.onAllAdsCompleted.bind(this));

  this._useIMA = false;

};
VideoAdManagerIMAWrapper.prototype.init = function(width, height, viewMode) {
  console.log('init', width, height, viewMode);
  this._useIMA ? this._imaWrapper.init(width, height, viewMode) : this._adsManager.init(width, height, viewMode);
};
VideoAdManagerIMAWrapper.prototype.start = function() {
  console.log('start');
  this._useIMA ? this._imaWrapper.start() : this._adsManager.start();
};
VideoAdManagerIMAWrapper.prototype.getDuration = function() {
  return this._useIMA ? this._imaWrapper.getDuration() : this._adsManager.getDuration();
};
VideoAdManagerIMAWrapper.prototype.getRemainingTime = function() {
  return this._useIMA ? this._imaWrapper.getRemainingTime() : this._adsManager.getRemainingTime();
};
VideoAdManagerIMAWrapper.prototype.resume = function() {
  this._useIMA ? this._imaWrapper.resume() : this._adsManager.resume();
};
VideoAdManagerIMAWrapper.prototype.pause = function() {
  this._useIMA ? this._imaWrapper.pause() : this._adsManager.pause();
};
VideoAdManagerIMAWrapper.prototype.stop = function() {
  this._useIMA ? this._imaWrapper.stop() : this._adsManager.stop();
};
VideoAdManagerIMAWrapper.prototype.skip = function() {
  this._useIMA ? this._imaWrapper.skip() : this._adsManager.skip();
};
VideoAdManagerIMAWrapper.prototype.resize = function(width, height, viewMode) {
  this._useIMA ? this._imaWrapper.resize(width, height, viewMode) : this._adsManager.resize(width, height, viewMode);
};
VideoAdManagerIMAWrapper.prototype.getVolume = function() {
  return this._useIMA ? this._imaWrapper.getVolume() : this._adsManager.getVolume();
};
VideoAdManagerIMAWrapper.prototype.setVolume = function(value) {
  this._useIMA ? this._imaWrapper.setVolume(value) : this._adsManager.setVolume(value);
};
VideoAdManagerIMAWrapper.prototype.collapse = function() {
  this._useIMA ? this._imaWrapper.collapse() : this._adsManager.collapse();
};
VideoAdManagerIMAWrapper.prototype.expand = function() {
  this._useIMA ? this._imaWrapper.expand() : this._adsManager.expand();
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
VideoAdManagerIMAWrapper.prototype.abort = function() {
  this._useIMA ? this._imaWrapper.abort() : this._adsManager.abort();
};

// Events
VideoAdManagerIMAWrapper.prototype.onAdsManagerLoaded = function() {
  this._callEvent(this.EVENTS.AdsManagerLoaded);
};
VideoAdManagerIMAWrapper.prototype.onAdError = function(message) {
  if (this.EVENTS.AdError in this._eventCallbacks) {
    this._eventCallbacks[this.EVENTS.AdError](typeof message !== 'object' ? new AdError(message) : message);
  }
};
VideoAdManagerIMAWrapper.prototype.onAdLog = function(message) {
  if (this.EVENTS.AdLog in this._eventCallbacks) {
    this._eventCallbacks[this.EVENTS.AdLog](message);
  }
};
VideoAdManagerIMAWrapper.prototype.onAdLoaded = function(adEvent) {
  if (this.EVENTS.AdLoaded in this._eventCallbacks) {
    this._eventCallbacks[this.EVENTS.AdLoaded](adEvent);
  }
};
VideoAdManagerIMAWrapper.prototype.onAdStarted = function() {
  this._callEvent(this.EVENTS.AdStarted);
};
VideoAdManagerIMAWrapper.prototype.onAdDurationChange = function() {
  this._callEvent(this.EVENTS.AdDurationChange);
};
VideoAdManagerIMAWrapper.prototype.onAdLinearChange = function() {
  this._callEvent(this.EVENTS.AdLinearChange);
};
VideoAdManagerIMAWrapper.prototype.onAdSkippableStateChange = function() {
  this._callEvent(this.EVENTS.AdSkippableStateChange);
};
VideoAdManagerIMAWrapper.prototype.onAdSizeChange = function() {
  this._callEvent(this.EVENTS.AdSizeChange);
};
VideoAdManagerIMAWrapper.prototype.onAdVolumeChange = function() {
  this._callEvent(this.EVENTS.AdVolumeChange);
};
VideoAdManagerIMAWrapper.prototype.onAdVideoStart = function() {
  this._callEvent(this.EVENTS.AdVideoStart);
};
VideoAdManagerIMAWrapper.prototype.onAdImpression = function() {
  this._callEvent(this.EVENTS.AdImpression);
};
VideoAdManagerIMAWrapper.prototype.onAdVideoFirstQuartile = function() {
  this._callEvent(this.EVENTS.AdVideoFirstQuartile);
};
VideoAdManagerIMAWrapper.prototype.onAdVideoMidpoint = function() {
  this._callEvent(this.EVENTS.AdVideoMidpoint);
};
VideoAdManagerIMAWrapper.prototype.onAdVideoThirdQuartile = function() {
  this._callEvent(this.EVENTS.AdVideoThirdQuartile);
};
VideoAdManagerIMAWrapper.prototype.onAdVideoComplete = function() {
  this._callEvent(this.EVENTS.AdVideoComplete);
};
VideoAdManagerIMAWrapper.prototype.onAdPaused = function() {
  this._callEvent(this.EVENTS.AdPaused);
};
VideoAdManagerIMAWrapper.prototype.onAdPlaying = function() {
  this._callEvent(this.EVENTS.AdPlaying);
};
VideoAdManagerIMAWrapper.prototype.onAdSkipped = function() {
  this._callEvent(this.EVENTS.AdSkipped);
};
VideoAdManagerIMAWrapper.prototype.onAdStopped = function() {
  this._callEvent(this.EVENTS.AdStopped);
};
VideoAdManagerIMAWrapper.prototype.onAdClickThru = function(url, id, playerHandles) {
  if (this.EVENTS.AdClickThru in this._eventCallbacks) {
    this._eventCallbacks[this.EVENTS.AdClickThru](url, id, playerHandles);
  }
};
VideoAdManagerIMAWrapper.prototype.onAdInteraction = function() {
  this._callEvent(this.EVENTS.AdInteraction);
};
VideoAdManagerIMAWrapper.prototype.onAdUserClose = function() {
  this._callEvent(this.EVENTS.AdUserClose);
};
VideoAdManagerIMAWrapper.prototype.onAllAdsCompleted = function() {
  this._callEvent(this.EVENTS.AllAdsCompleted);
};

VideoAdManagerIMAWrapper.prototype._callEvent = function(eventName) {
  if(eventName in this._eventCallbacks) {
    this._eventCallbacks[eventName]();
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
