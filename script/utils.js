if (window.bhv === undefined) {
  window.bhv = {};
}

/**
 * Some utilities.
 */
window.bhv.utils = {

  setBack: function(region) {
    var i, lnks,
        key = window.bhv.request.utils.getKey();

    if (key) {
      lnks = document.querySelectorAll('div#header a');
      if (lnks) {
        for (i = 0; i < lnks.length; ++i) {
          lnks[i].setAttribute('href', lnks[i].getAttribute('href') + '#'
            //+ region + '_' + key);
            + key);
        }
      }
    }
  }
}
