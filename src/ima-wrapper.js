/*global google*/
import {loadScript} from './utils';

const IMAWrapper = function(adContainer, videoElement, callback) {

  if(!(adContainer && (adContainer instanceof HTMLElement
    || adContainer.getRootNode))
    || !(videoElement && (videoElement instanceof HTMLElement
      || videoElement.getRootNode))) {
    throw new Error('ad container and/or video element not defined');
  }

  this._adContainer = adContainer;
  this._videoElement = videoElement;
  this._callback = callback;

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

  // IMA global variables
  this._adsLoader = null;
  this._adDisplayContainer = null;
  this._adDisplayContainerInitialized = false;
  this._adsManager = null;
  this._currentAd = null;

  // Attributes
  this._attributes = {
    version: '!!#Version#!!'
  };

  // Options
  this._options = {
    autoplay: true,
    muted: true,
    secure: false, // default false, google.ima.ImaSdkSettings.VpaidMode.INSECURE
    vastLoadTimeout: 23000,
    loadVideoTimeout: 8000, // default value is 8000 ms = 8 sec, timeout to load video of the ad
    omid: null // Open Measurement (OM) SDK, default null, { 'GOOGLE': 'FULL', 'OTHER': 'DOMAIN' }
  };

  this._hasLoaded = false;
  this._hasStarted = false;

  // IMA SDK ima3.js
  this.IMA_SDK_SRC = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
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
        this.setupIMA();
      } else {
        console.log('ima3.js is not loaded');
        if(this._callback
          && typeof this._callback === 'function') {
          this._callback('ima3.js - failed to load');
        }
      }
    });
  } else {
    console.log('ima3.js is included, use it');
    this.setupIMA();
  }

};
IMAWrapper.prototype.setupIMA = function() {
  console.log('setup IMA');
  google.ima.settings.setDisableCustomPlaybackForIOS10Plus(true);

  this._adDisplayContainer = new google.ima.AdDisplayContainer(this._adContainer, this._videoElement);
  this._adsLoader = new google.ima.AdsLoader(this._adDisplayContainer);

  // Listen and respond to ads loaded and error events.
  this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onIMAAdsManagerLoaded.bind(this), false);
  this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onIMAAdsManagerAdError.bind(this), false);

  // Complete
  this._videoElement.onended = this.doContentComplete;

  if(this._callback
    && typeof this._callback === 'function') {
    this._callback();
  }
};
IMAWrapper.prototype.doContentComplete = function() {
  this._adsLoader && this._adsLoader.contentComplete();
};
IMAWrapper.prototype.maybeInitializeAdDisplayContainer = function() {
  this._adDisplayContainerInitialized || (this._adDisplayContainer.initialize(), this._adDisplayContainerInitialized = true);
};
IMAWrapper.prototype.init = function(width, height, viewMode) {
  console.log('ima init');
  try {
    this.maybeInitializeAdDisplayContainer();
    this._adsManager && this._adsManager.init(width, height, viewMode);
  } catch (adError) {
    this.onAdError(adError);
  }
};
IMAWrapper.prototype.start = function() {
  console.log('ima start');
  try {
    this._adsManager && this._adsManager.start();
  } catch (adError) {
    this.onAdError(adError);
  }
};
IMAWrapper.prototype.getDuration = function() {
  return this._currentAd ? this._currentAd.getDuration() : -2
};
IMAWrapper.prototype.getRemainingTime = function() {
  return this._adsManager ? this._adsManager.getRemainingTime() : -2
};
IMAWrapper.prototype.resume = function() {
  this._adsManager && this._adsManager.resume();
};
IMAWrapper.prototype.pause = function() {
  this._adsManager && this._adsManager.pause();
};
IMAWrapper.prototype.stop = function() {
  this._adsManager && this._adsManager.stop();
};
IMAWrapper.prototype.skip = function() {
  if(this._adsManager) {
    if (this._adsManager.getAdSkippableState()) {
      this._adsManager.skip();
    }
    // Force skip
    //this.onIMAAdSkipped();
    this.onAdSkipped();
  }
};
IMAWrapper.prototype.resize = function(width, height, viewMode) {
  this._adsManager && (this._adsManager.resize(width, height, viewMode), this.onAdSizeChange());
};
IMAWrapper.prototype.getVolume = function() {
  return this._adsManager && this._adsManager.getVolume()
};
IMAWrapper.prototype.setVolume = function(volume) {
  this._adsManager && this._adsManager.setVolume(volume);
};
IMAWrapper.prototype.getSkippableState = function() {
  return this._adsManager && this._adsManager.getAdSkippableState();
};
IMAWrapper.prototype.collapse = function() {
  this._adsManager && this._adsManager.collapse();
};
IMAWrapper.prototype.expand = function() {
  this._adsManager && this._adsManager.expand();
};
IMAWrapper.prototype.requestAds = function(vastUrl, options) {

  this.abort();
  console.log('ima requestAds', vastUrl, options);

  // Assign options
  Object.assign(this._options, options);

  // Create adsRequest
  const adsRequest = new google.ima.AdsRequest();
  // Check if vastUrl is URL
  let isURL = false;
  try {
    new URL(vastUrl);
    isURL = true;
  } catch (e) {}

  // Use VAST URL or VAST XML
  isURL ? adsRequest.adTagUrl = vastUrl : adsRequest.adsResponse = vastUrl;

  // Get/Set options
  this._options.pageUrl && (adsRequest.pageUrl = this._options.pageUrl);

  adsRequest.vastLoadTimeout = this._options.vastLoadTimeout;

  adsRequest.linearAdSlotWidth = this._videoElement.width;
  adsRequest.linearAdSlotHeight = this._videoElement.height;
  adsRequest.nonLinearAdSlotWidth = this._videoElement.width;
  adsRequest.nonLinearAdSlotHeight = this._videoElement.height;

  if(this._options.omid) {
    // Omid Access Mode Rules
    adsRequest.omidAccessModeRules = {};
    for(const vendor in this._options.omid) {
      if(google.ima.OmidVerificationVendor[vendor] && google.ima.OmidAccessMode[this._options.omid[vendor]]) {
        adsRequest.omidAccessModeRules[google.ima.OmidVerificationVendor[vendor]] = google.ima.OmidAccessMode[this._options.omid[vendor]];
      }
    }
  }

  adsRequest.setAdWillAutoPlay(this._options.autoplay);
  console.log('ima ad will play muted', this._options.muted);
  if(this._options.muted) {
    adsRequest.setAdWillPlayMuted(this._options.muted);
  }

  this._adsLoader.getSettings().setVpaidMode(this._options.secure ?
    google.ima.ImaSdkSettings.VpaidMode.ENABLED :
    google.ima.ImaSdkSettings.VpaidMode.INSECURE
  );
  // Request ads
  this._adsLoader.requestAds(adsRequest);
};
IMAWrapper.prototype.abort = function() {
  console.log('ima destroy adsManager');
  this._currentAd = null;

  this._hasLoaded = false;
  this._hasStarted = false;
  // Destroy
  this._adsManager && (this._adsManager.destroy(), this._adsManager = null);
  this.doContentComplete();
};
IMAWrapper.prototype._abort = function() {
  this.abort();
  // Dispatch AllAdsCompleted
  this.onAllAdsCompleted();
}

// IMA Events
IMAWrapper.prototype.onIMAAdsManagerLoaded = function(adsManagerLoadedEvent) {

  console.log('ima adsManager loaded');

  const adsRenderingSettings = new google.ima.AdsRenderingSettings;
  adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
  adsRenderingSettings.loadVideoTimeout = this._options.loadVideoTimeout;

  this._adsManager = adsManagerLoadedEvent.getAdsManager(this._videoElement, adsRenderingSettings);

  this._adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onIMAAdError.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.AD_BREAK_READY, function() {});
  this._adsManager.addEventListener(google.ima.AdEvent.Type.AD_METADATA, function() {});
  this._adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, this.onAllAdsCompleted.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, this.onIMAAdClickThru.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.onIMAAdVideoComplete.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onAdStarted.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onAdStopped.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.DURATION_CHANGE, this.onAdDurationChange.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE, this.onAdVideoFirstQuartile.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.IMPRESSION, this.onAdImpression.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.INTERACTION, this.onAdInteraction.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.LINEAR_CHANGED, this.onAdLinearChange.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, this.onIMAAdLoaded.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.LOG, this.onIMAAdLog.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT, this.onAdVideoMidpoint.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, this.onAdPaused.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, this.onAdPlaying.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED, this.onAdSkippableStateChange.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, this.onAdSkipped.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, this.onAdVideoStart.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE, this.onAdVideoThirdQuartile.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.USER_CLOSE, this.onAdUserClose.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, this.onAdVolumeChange.bind(this));
  this._adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, this.onAdVolumeChange.bind(this));

  this.onAdsManagerLoaded();
};
IMAWrapper.prototype.onIMAAdsManagerAdError = function(adsManagerAdErrorEvent) {
  this.onAdError(adsManagerAdErrorEvent.getError()); //.getError().getErrorCode() + ' ' + adsManagerAdErrorEvent.getError().getMessage());
};
IMAWrapper.prototype.onIMAAdClickThru = function(adEvent) {
  this.onAdClickThru('', adEvent.getAd().getAdId(), false);
};
IMAWrapper.prototype.onIMAAdVideoComplete = function() {
  this.onAdVideoComplete();
};
IMAWrapper.prototype.onIMAAdLoaded = function(adEvent) {
  this._hasLoaded = true;
  this._currentAd = adEvent.getAd();
  this.onAdLoaded(this._currentAd);
};
IMAWrapper.prototype.onIMAAdError = function(adErrorEvent) {
  console.log('ima error', adErrorEvent);
  this.onAdError(adErrorEvent.getError()); //.getError().getErrorCode() + ' ' + adErrorEvent.getError().getMessage() + ' ' + adErrorEvent.getError().getInnerError())
};
IMAWrapper.prototype.onIMAAdLog = function(adEvent) {
  (adEvent = adEvent.getAdData()).hasOwnProperty('adError') ? this.onAdLog(adEvent.adError.getMessage()) : this.onAdLog('IMA Ad Log');
};

// Events
IMAWrapper.prototype.onAdsManagerLoaded = function() {
  this._callEvent(this.EVENTS.AdsManagerLoaded);
};
IMAWrapper.prototype.onAdLoaded = function(currentAd) {
  if (this.EVENTS.AdLoaded in this._eventCallbacks) {
    this._eventCallbacks[this.EVENTS.AdLoaded](currentAd);
  }
};
IMAWrapper.prototype.onAdStarted = function() {
  this._hasStarted = true;
  this._callEvent(this.EVENTS.AdStarted);
};
IMAWrapper.prototype.onAdDurationChange = function() {
  this._callEvent(this.EVENTS.AdDurationChange);
};
IMAWrapper.prototype.onAdLinearChange = function() {
  this._callEvent(this.EVENTS.AdLinearChange);
};
IMAWrapper.prototype.onAdSkippableStateChange = function() {
  this._callEvent(this.EVENTS.AdSkippableStateChange);
};
IMAWrapper.prototype.onAdSizeChange = function() {
  this._callEvent(this.EVENTS.AdSizeChange);
};
IMAWrapper.prototype.onAdVolumeChange = function() {
  this._callEvent(this.EVENTS.AdVolumeChange);
};
IMAWrapper.prototype.onAdVideoStart = function() {
  this._callEvent(this.EVENTS.AdVideoStart);
};
IMAWrapper.prototype.onAdImpression = function() {
  this._callEvent(this.EVENTS.AdImpression);
};
IMAWrapper.prototype.onAdVideoFirstQuartile = function() {
  this._callEvent(this.EVENTS.AdVideoFirstQuartile);
};
IMAWrapper.prototype.onAdVideoMidpoint = function() {
  this._callEvent(this.EVENTS.AdVideoMidpoint);
};
IMAWrapper.prototype.onAdVideoThirdQuartile = function() {
  this._callEvent(this.EVENTS.AdVideoThirdQuartile);
};
IMAWrapper.prototype.onAdVideoComplete = function() {
  this._callEvent(this.EVENTS.AdVideoComplete);
};
IMAWrapper.prototype.onAdPaused = function() {
  this._callEvent(this.EVENTS.AdPaused);
};
IMAWrapper.prototype.onAdPlaying = function() {
  this._callEvent(this.EVENTS.AdPlaying);
};
IMAWrapper.prototype.onAdSkipped = function() {
  this._callEvent(this.EVENTS.AdSkipped);
  // abort the ad, unsubscribe and reset to a default state
  this._abort();
};
IMAWrapper.prototype.onAdStopped = function() {
  /*
  if(!this._hasStarted) {
    this.onAdError('ad stopped before ad started');
  } else {
    this._callEvent(this.EVENTS.AdStopped);
    // abort the ad, unsubscribe and reset to a default state
    //this._abort();
  }
   */
  this._callEvent(this.EVENTS.AdStopped);
};
IMAWrapper.prototype.onAdClickThru = function(url, id, playerHandles) {
  if (this.EVENTS.AdClickThru in this._eventCallbacks) {
    this._eventCallbacks[this.EVENTS.AdClickThru](url, id, playerHandles);
  }
};
IMAWrapper.prototype.onAdInteraction = function() {
  this._callEvent(this.EVENTS.AdInteraction);
};
IMAWrapper.prototype.onAdUserClose = function() {
  this._callEvent(this.EVENTS.AdUserClose);
};
IMAWrapper.prototype.onAllAdsCompleted = function() {
  //this.abort();
  this._callEvent(this.EVENTS.AllAdsCompleted);
};
IMAWrapper.prototype.onAdError = function(message) {
  //this.abort();
  if (this.EVENTS.AdError in this._eventCallbacks) {
    this._eventCallbacks[this.EVENTS.AdError](message);
  }
};
IMAWrapper.prototype.onAdLog = function(message) {
  if (this.EVENTS.AdLog in this._eventCallbacks) {
    this._eventCallbacks[this.EVENTS.AdLog](message);
  }
};
IMAWrapper.prototype._callEvent = function(eventName) {
  if(eventName in this._eventCallbacks) {
    this._eventCallbacks[eventName]();
  }
};
IMAWrapper.prototype.addEventListener = function(eventName, callback, context) {
  const givenCallback = callback.bind(context);
  this._eventCallbacks[eventName] = givenCallback;
};
IMAWrapper.prototype.removeEventListener = function(eventName) {
  this._eventCallbacks[eventName] = null;
};
IMAWrapper.prototype.getVersion = function() {
  return this._attributes.version;
};

export default IMAWrapper;
