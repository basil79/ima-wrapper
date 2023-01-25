import IMAWrapper from '../src/ima-wrapper';

describe('IMAWrapper', function() {
  describe('#constructor', () => {

    it('check constructor', () => {
      const adContainer = document.createElement('div');
      const videoElement = document.createElement('video');
      const adsManager = new IMAWrapper(adContainer, videoElement);

    })

  })
});
