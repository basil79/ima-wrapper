# ima-wrapper

> Wrapper for [IMA SDK for HTML5](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side).

NOTE: If you have already included the [ima3.js](https://imasdk.googleapis.com/js/sdkloader/ima3.js) script, the wrapper will check the IMA SDK Client Side version if it was included and use it, if not, the wrapper will try to load `ima3.js` from `//imasdk.googleapis.com/js/sdkloader/ima3.js`.

**Table of Contents**

- [Usage](#Usage)
- [Documentation](#Documentation)
- [Install](#Install)
- [Build](#Build)
- [Run](#Run)
- [Contribute](#Contribute)

## Usage

## Documentation

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
