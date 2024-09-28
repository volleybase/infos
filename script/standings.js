var map = {
  // BL
  'sta-bl': [34267, leagueStandings, 'Bundesliga', 43480],
  // UL-2
  'sta-ul2': [34791, leagueStandings, 'Unterliga - 2', 44267],
  // UL-3
  'sta-ul3': [34792, leagueStandings, 'Unterliga - 3', 44278]
};

/**
 * Creates the standings for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function kidsStandings(response) {
  doKidsStandings(response, false);
}

/**
 * Creates the final standings for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function kidsStandingsF(response) {
  doKidsStandings(response, true);
}

/**
 * Creates the standings for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @param {boolean} final True for the final standings, otherwise false.
 * @return {void}
 */
function doKidsStandings(response, final) {

  // create xml data
  var xml = window.bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of standings
    var list = window.bhv.request.xml.getNodes(xml, 'tabelle');
    if (list && list.length) {

      var container
        = '<div class="container" title="{{text2}}" alt="{{text2}}">'
        + '<input id="info_{{idx}}" type="checkbox" class="info">'
        + '<label for="info_{{idx}}">{{text}}<span>{{text2}}</span></label>'
        + '</div>',
          points = container
            .replace(/\{\{idx\}\}/g, 'pt')
            .replace(/\{\{text\}\}/g, 'P')
            .replace(/\{\{text2\}\}/g, 'Punkte'),
          tournaments = container
            .replace(/\{\{idx\}\}/g, 'tour')
            .replace(/\{\{text\}\}/g, 'T')
            .replace(/\{\{text2\}\}/g, 'gespielte Turniere');

      // create text
      var msg = window.bhv.request.utils.fillColumn('', 47)
        .replace(/ /g, '&nbsp;');
      if (!final) {
        msg += points + '&nbsp;&nbsp;&nbsp;' + tournaments;
      }
      msg += NL;

      for (var i = 0; i < list.length; ++i) {
        msg += window.bhv.request.utils.fillColumn('' + (i + 1), -2) + '. ';
        if (final) {
          msg += window.bhv.request.utils.checkBold(window.bhv.request.xml.findNode(list[i].childNodes, 'tea_name'));
        } else {
          msg += window.bhv.request.utils.checkBold(window.bhv.request.utils.fillColumn(
              window.bhv.request.xml.findNode(list[i].childNodes, 'tea_name'), 40))
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'punkte'), -4)
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'gespielt'), -3)
            + '&nbsp;';
        }
        msg += NL;
      }

      // add created text to page
      window.bhv.request.utils.inject(window.bhv.request.utils.getTitle(map) + msg);
    }
  }
}

/**
 * Creates the standings for a league.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function leagueStandings(response) {

  // create xml data
  var xml = window.bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of standings
    var list = window.bhv.request.xml.getNodes(xml, 'tabelle');
    if (list && list.length) {

      // create text
      var msg = window.bhv.request.utils.fillColumn('', 56)
          + 'S/N  Sätze   Punkte'.replace(/ /g, '&nbsp;') + NL
          + window.bhv.request.utils.fillColumn('', 50)
          + 'Sp.  +  -   +  -    +   -  P '.replace(/ /g, '&nbsp;') + NL;
      for (var i = 0; i < list.length; ++i) {
        msg += window.bhv.request.utils.fillColumn('' + (i + 1), -2) + '. '
            + window.bhv.request.utils.checkBold(window.bhv.request.utils.fillColumn(
              window.bhv.request.xml.findNode(list[i].childNodes, 'tea_name'), 45))
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'gespielt'), -3)
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'gewonnen'), -4)
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'verloren'), -3)
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'satzgewonnen'), -4)
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'satzverloren'), -3)
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'punktgewonnen'), -5)
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'punktverloren'), -4)
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'punkte'), -3)
            + '&nbsp;' + NL;
      }

      // add created text to page
      window.bhv.request.utils.inject(window.bhv.request.utils.getTitle(map) + msg);
    }
  }
}

/**
 * Starts the loading of the standings.
 * 
 * @return {void}
 */
function getStandings() {
  var found = false,
      key = window.bhv.request.utils.getKey();

  if (map && key && map[key]) {
    found = window.bhv.request.queryStandings(
      map[key][0], map[key][1],
      logStandingsError
    );
  }

  if (!found) {
    window.bhv.request.utils.inject('Ungültige Tabelle!');
  }
}

function logStandingsError(info) {
  log('---------------------------------------------------------------------');
  log('Cannot load standings!');
  log('---------------------------------------------------------------------');
  if (info) {
    log(info);
    log('---------------------------------------------------------------------');
  }
}
