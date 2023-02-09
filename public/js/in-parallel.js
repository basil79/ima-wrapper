(function() {

  console.log('in parallel');
  var testAdButton = document.getElementById('test-ad-button');

  function requestAds() {
    var tags = document.getElementById('vast-url-input').value;
    console.log(tags.split(','));
  }

  testAdButton.addEventListener('click', function() {
    console.log('test button click');
    requestAds();
  });


})();
