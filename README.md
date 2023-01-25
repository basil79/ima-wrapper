# ima-wrapper

> Wrapper for IMA SDK HTML5.

NOTE: If you have already included the [ima3.js](//imasdk.googleapis.com/js/sdkloader/ima3.js) script in the page, the wrapper will check the IMA SDK client side version if it was included and use it, if not, the wrapper will try to load `ima3.js` from `//imasdk.googleapis.com/js/sdkloader/ima3.js`.

**Table of Contents**

- [Usage](#Usage)
- [Documentation](#Documentation)
- [Install](#Install)
- [Build](#Build)
- [Run](#Run)
- [Contribute](#Contribute)

## Usage

```javascript
import IMAWrapper from 'ima-warpper';

// Get your HTML element for ad container
const adContainer = document.getElementById('ad-container');
// Get your video element
const videoElement = document.getElementById('video');
// Define IMA wrapper, pass ad container and video element
const adsManager = new IMAWrapper(adContainer, videoElement, (error) => {
    if(error) {
        console.log(error);
        return;
    }
});
// Subscribe for events
// AdsManagerLoaded
adsManager.addEventListener('AdsManagerLoaded', function() {
    // Get height and width of your video element
    let width = videoElement.clientWidth;
    let height = videoElement.clientHeight;
    let viewMode = 'normal'; // fullscreen
    // Init
    try {
        adsManager.init(width, height, viewMode);
    } catch (adError) {
        // Play your context without ads, if an error occurs
    }
});
// AdError
adsManager.addEventListener('AdError', function(adError) {
    if(adsManager) {
        // Removes ad assets loaded at runtime that need to be properly removed at the time of ad completion
        // and stops the ad and all tracking.
        adsManager.abort();
    }
    // ... 
});
// AdLoaded
adsManager.addEventListener('AdLoaded', function(adEvent) {
    // Ad loaded, awaiting start
    // Check if ad type is linear
    if(adEvent.isLinear()) {
        try {
            // Start ad
            adsManager.start();
        } catch (adError) {
            // Play video content without ads in case of error
        }
    } else {
        // Ad is not linear
    }
});
// AdStarted
adsManager.addEventListener('AdStarted', function() {
    // Pause your video content
    videoElement.pause();
});
// ...
// AdDurationChange
// AdSizeChange
// AdImpression
// AdVideoStart
// AdVideoFirstQuartile
// AdVideoMidpoint
// AdVideoThirdQuartile
// AdVideoComplete
// AdPaused
// AdPlaying
// AdStopped
// AdSkipped
// AdClickThru
// ...
// AllAdsCompleted
adsManager.addEventListener('AllAdsCompleted', function() {
    // Play your video content
    videoElement.play();
});


// VAST tag url
let vastUrl = 'your VAST tag url';

// Request Ads
adsManager.requestAds(vastUrl);

/*
// VAST XML
let vastXML = `<?xml version="1.0" encoding="UTF-8"?>
    <VAST version="2.0">
      <Error><![CDATA[http://example.com/empty-no-ad]]></Error>
    </VAST>`;
adsManager.requestAds(vastXML);
 */
```

## Documentation

### Pre-bundled versions

### Browser script

A pre-bundled version of ima-wrapper is available: [`ima-wrapper.js`](dist/ima-wrapper.js) [minified].

You can add the script directly to your page and access the library's components through the `adserve.tv` object.

```html
<script src="ima-wrapper.js"></script>
```

```javascript
// Get your HTML elements for ad container and video element
const adContainer = document.getElementById('ad-container');
const videoElement = document.getElementById('video-element');
// Define IMA wrapper, pass ad container and video element
const adsManager = new adserve.tv.IMAWrapper(adContainer, videoElement, (error) => {
   if(error) {
       console.log(error);
       return;
   } 
});
```

## Install

### Get Started

### Using Git

    $ git clone https://github.com/basil79/ima-wrapper.git
    $ cd ima-wrapper
    $ npm ci

## Build

To build the project for development:

    $ npm run build:dev

To build the project for production:

    $ npm run build:prod

This will generate the following file:

+ `./dist/ima-wrapper.js` - Minified browser production code

## Run

    $ npm start

Then navigate to: http://localhost:8087 in your browser

### Supported Browsers

ima-wrapper is supported all modern browsers.

## Contribute

See [CONTRIBUTING](./CONTRIBUTING.md)
