var map = {
  // BL
  'pla-bl': [43480, null, 'Bundesliga'],
  'pla-blcup': [43518, null, 'Bundesliga - Cup'],
  // UL-2
  'pla-ul2': [44267, null, 'Unterliga - 2'],
  // UL-3
  'pla-ul3': [44278, null, 'Unterliga - 3']
}

function getPlayers() {
  var key = window.bhv.request.utils.getKey();

  if (map[key]) {
    window.bhv.request.queryPlayers(
      map[key][0],
      handlePlayers, _logPlayersError
    );
  }
}

/**
 * Create the html view of the players and inject it into page.
 * 
 * @param {string} response The response from volleynet server (or from
 * archive).
 */
function handlePlayers(response) {

  // create xml data
  var msg = '',
      xml = window.bhv.request.xml.fromText(response, 'xml');

  if (xml) {
    // get list of players and staff
    var players = window.bhv.request.xml.getNodes(xml, 'kader');

    if (players && players.length) {
      var xplayer = false, funktion;

      for (var i = 0; i < players.length; ++i) {
        msg += NL;

        funktion = window.bhv.request.xml.findNode(players[i].childNodes,
          'funktion');
        if (funktion !== 'Spieler' && !xplayer) {
          xplayer = true;
          msg += NL;
        }

        msg += window.bhv.request.xml.findNode(players[i].childNodes, 'vorname')
          + ' '
          + window.bhv.request.xml.findNode(players[i].childNodes, 'name');

        // if not player: add info
        if (xplayer) {
          msg += ' (' + funktion + ')';
        }
      }
    }
  }

  // add created text to page
  window.bhv.request.utils.inject(window.bhv.request.utils.getTitle(map) + msg);
}

function _logPlayersError(info) {
  log('---------------------------------------------------------------------');
  log('Cannot read players!');
  log('---------------------------------------------------------------------');
  if (info) {
    log(info);
    log('---------------------------------------------------------------------');
  }
}
