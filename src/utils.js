function loadScript(src, async = false, callback) {
  const firstElement = document.getElementsByTagName('head')[0] || document.documentElement,
    scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.src = src;
  scriptElement.async = async;
  scriptElement.addEventListener('load', function() {
    if(callback && typeof callback === 'function') {
      callback(true, window);
    }
  }, false);
  scriptElement.addEventListener('error', function() {
    firstElement.removeChild(scriptElement);
    if(callback && typeof callback === 'function') {
      callback(false);
    }
  }, false);
  firstElement.insertBefore(scriptElement, firstElement.firstChild);
}

function format(message, ...values) {
  try {
    values.forEach((value, key) => {
      message = message.replace(
        new RegExp('\\{' + key + '}', 'g'),
        value
      )
    });
  } catch (e) {}
  return message
}

export {
  loadScript,
  format
}