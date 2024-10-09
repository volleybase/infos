if (window.bhv === undefined) {
  window.bhv = {};
}

/**
 * The overview handler.
 */
window.bhv.overview = {

  /**
   * Loads the data for the overview and injects it into the overview page.
   */
  load: function() {
    window.bhv.request.requestOV(
      (text, headers) => {
        var content = '';
        if (text) {
          var parts = text.split('\n');
          if (parts) {
            for (var i = 0; i < parts.length; ++i) {
              var part = parts[i],
                  part2 = part.trim();
              if (part2) {
                if (part2 == '<<') {
                  // end of group
                  content += '</div>\n';
  
                // ignore comments (#)
                } else if (part2.charAt(0) != '#') {
  
                  var subparts = part2.split(':');
                  if (subparts && subparts.length) {
                    switch (subparts[0]) {
                      case 'L1':  // links
                      case 'L2':
                      case 'L3':
                        if (subparts.length == 4) {
                          var hsize = subparts[0].substring(1);
                          content += '<a id="' + subparts[1] + '" href="' + subparts[3] + '"><h' + hsize + '>' + subparts[2] + '</h' + hsize + '></a>\n';
                        }
                        break;
  
                      case 'D':  // dates
                        if (subparts.length == 3) {
                          content += '<a id="' + subparts[1] + '" href="schedule.html?key=' + subparts[1] + '"><h3>' + subparts[2] + '</h3></a>';
                        }
                        break;
                      case 'R':  // results
                        if (subparts.length == 3) {
                            content += '<a id="' + subparts[1] + '" href="results.html?key=' + subparts[1] + '"><h3>' + subparts[2] + '</h3></a>';
                          }
                        break;
                      case 'S':  // standings
                        if (subparts.length == 3) {
                          content += '<a id="' + subparts[1] + '" href="standings.html?key=' + subparts[1] + '"><h3>' + subparts[2] + '</h3></a>';
                        }
                        break;
                      case 'P':  // players
                        if (subparts.length == 3) {
                          content += '<a id="' + subparts[1] + '" href="players.html?key=' + subparts[1] + '"><h3>' + subparts[2] + '</h3></a>';
                        }
                        break;

                      case 'A':
                        if (subparts.length == 3) {
                          content += '<a id="' + subparts[1] + '" href="presence.html?key=' + subparts[1] + '"><h3>' + subparts[2] + '</h3></a>';
                        }
                        break;

                      case 'TB':
                        if (subparts.length == 3) {
                          content += '<a id="' + subparts[1] + '" href="diary.html?key=' + subparts[1] + '"><h3>' + subparts[2] + '</h3></a>';
                        }
                        break;
  
                      default: // headers
                        var lev = 0;
                        while (lev < 5 && part.charAt(lev) == ' ') {
                          ++lev;
                        }
  
                        var clazz = '',
                            id = '',
                            id2 = '';
                        if (part2.charAt(0) == '>') {
                          var posEnd = part2.indexOf('>', 1);
                          if (posEnd > 2) {
                            id = ' id="' + part2.substring(1, posEnd) + '"';
                            id2 = ' id="' + part2.substring(1, posEnd) + '_2"';
                            part2 = part2.substring(posEnd + 1);
                            clazz = ' class="expandable"';
                          }
                        }
  
                        content += '<h' + (lev + 1) + id + clazz + '>' + part2 + '</h' + (lev + 1) + '>\n';
                        if (id) {
                          content += '<div ' + id2 + ' class="expanded_container">\n';
                        }
                    }
                  }
                }
              }
            }
          }
        }
  
        var nav = document.getElementById('nav');
        if (nav) {
          nav.innerHTML = content;
        }
  
        this._init();
      },
      (info) => {
        console.log(info);
      }
    );
  },
  
  /**
   * Initializes the overview (expanders).
   * 
   * return {void}
   */
  _init: function() {
    var expanders = [],
    expanders0 = document.getElementsByClassName('expandable'),
    keepOpen = {},
    links = document.getElementsByTagName('a');
  
    // init expanders
    for (var i = 0, i2 = expanders0.length; i < i2; ++i) {
      var id = expanders0[i].id;
      if (id) {
        expanders.push(id);
      }
    }
  
    // calculates keep open on return to overview
    var checkElems = function(elem) {
  
      if (elem && elem.id) {
        var par = elem.parentNode;
  
        while (par && par.className && par.className.indexOf('expanded_container') >= 0) {
          var id = par.id.substring(0, par.id.length - 2);
          if (keepOpen[id] === undefined) {
            keepOpen[id] = [];
          }
          keepOpen[id].push(elem.id);
  
          par = par.parentNode;
        }
      }
    }
  
    for (var i = 0, i2 = expanders0.length; i < i2; ++i) {
      checkElems(expanders0[i]);
    }
    for (var i = 0, i2 = links.length; i < i2; ++i) {
      checkElems(links[i]);
    }
  
    // console.log(keepOpen);
  
    // initializes the expanders
    window.bhv.elements.expander.init(expanders, keepOpen);
  
    // try to show source of previous action
    var key = location.hash;
    if (key && key.length) {
      var elem = document.getElementById(key.substring(1));
      if (elem) {
        elem.scrollIntoView();
      }
    }
  }
  /*
  function addEvent(elem, event, handler) {
    if (elem.addEventListener) {
      elem.addEventListener(event, handler);
    } else if (elem.attachEvent)  {
      elem.attachEvent('on' + event, function(ev) {
        if (!ev) ev = window.event;
        if (ev.target == undefined) {
          ev.target = ev.srcElement;
        }
        handler(ev);
      });
    }
  }*/
};
