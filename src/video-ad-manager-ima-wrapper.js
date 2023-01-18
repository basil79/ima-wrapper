const VideoAdManagerIMAWrapper = function(adContainer, videoElement) {

  if(!(adContainer instanceof Element || adContainer instanceof HTMLDocument) || !(videoElement instanceof Element || videoElement instanceof HTMLDocument)) {
    throw new Error('ad container and/or video element are not defined');
  }

  this._adContainer = null;
  this._videoElement = null;

  this._attributes = {
    width: 300,
    height: 154,
    viewMode: 'normal',
    volume: 0,
    version: '!!#Version#!!'
  };
  this._eventCallbacks = {};

  this.IMA_SDK_URL = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';

  this._adsManager = null; // TODO
  this._imaManager = null; // TODO


  this.initAdsManager();
  this.initIMAManager();

};
VideoAdManagerIMAWrapper.prototype.init = function(width, height, viewMode) {
  console.log('init');
};
// TODO:
VideoAdManagerIMAWrapper.prototype.initAdsManager = function() {
  console.log('init ads manager');
};
VideoAdManagerIMAWrapper.prototype.initIMAManager = function() {
  console.log('init ima');
  // Check that Client Side IMA SDK has been included
  // NOTE: (window['google'] && google.ima) check for any
  // IMA SDK, including SDK for Server Side ads.
  // The 3rd check insures we have the right SDK:
  // {google.ima.AdsLoader} is an object that's part of Client Side IMA SDK
  // but not Server Side SDK.
  if (!window['google'] || !google.ima || !google.ima.AdsLoader) {
    console.log('ima3.js is not included');
  } else {
    console.log('ima3.js is included, use it');
  }
};

VideoAdManagerIMAWrapper.prototype.requestAds = function(vastUrl, options = {}) {
  console.log('request ads', vastUrl);
};
VideoAdManagerIMAWrapper.prototype.resize = function(width, height, viewMode) {
  // TODO:
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
