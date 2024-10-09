function getDiary() {
  var key = window.bhv.request.utils.getKey();

  window.bhv.request.queryDiary(
    key, handleDiary, _logDiaryError
  );
}

function handleDiary(response) {
  var msg = '';
  if (window.DOMParser) {
    var parser = new DOMParser();
    var dom = parser.parseFromString(response, 'text/xml');

    var texts = dom.getElementsByTagName('text');
    for (var t = 0; t < texts.length; ++t) {
      msg += texts[t].textContent;      
    }
  }

  window.bhv.request.utils.inject(msg, true);
}

function _logDiaryError(info) {
  log('---------------------------------------------------------------------');
  log('Cannot read diary!');
  log('---------------------------------------------------------------------');
  if (info) {
    log(info);
    log('---------------------------------------------------------------------');
  }
}
