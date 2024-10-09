function getPresence() {
  var key = window.bhv.request.utils.getKey();

  window.bhv.request.queryPresence(
    key, handlePresence, _logPresenceError
  );
}

function handlePresence(response) {
  var msg = '';
  if (window.DOMParser) {
    var parser = new DOMParser();
    var dom = parser.parseFromString(response, 'text/xml');

    var h1 = dom.getElementsByTagName('header1')[0];
    var infosH1 = h1.getElementsByTagName('info');
    var h2 = dom.getElementsByTagName('header2')[0];
    var infosH2 = h2.getElementsByTagName('info');
    var clazzes = h2.getElementsByTagName('class');

    msg += '<div class="grayed">';
    for (var i = 0; i < infosH1.length; ++i) {
      msg += div(div(infosH1[i].textContent, 'rotate'), clazzes[i].textContent.replace("small-text", "").trim());
    }
    msg += '</div><br>';

    msg += '<div class="grayed">';
    for (var i = 0; i < infosH2.length; ++i) {
      var txt = infosH2[i].textContent;
      var clazz = clazzes[i].textContent;
      msg += div(clazz.indexOf("small-text") >= 0 ? span(txt) : txt, clazz);
    }
    msg += '</div>';

    var items = dom.getElementsByTagName('item');
    for (var i = 0; i < items.length; ++i) {
      var line = '';
      var clazz = undefined;
      var item = items[i];

      var names = item.getElementsByTagName('name');
      if (names && names.length) {
        var name = names[0];
        line += div(name.textContent);
        var sum = item.getElementsByTagName('sum')[0];
        line += div(sum.textContent);
        var perc = item.getElementsByTagName('percentage')[0];
        line += div(perc.textContent);
        var presence = item.getElementsByTagName('presence')[0].textContent;
        for (var p = 0; p < presence.length; ++p) {
          var pre = presence.charAt(p);
          line += div(pre === '#' ? '&#128512;' : '', clazzes[p + 3].textContent.replace("small-text", "").trim());
        }
      } else {
        clazz = 'grayed';
        var values = item.getElementsByTagName('value');
        if (values && values.length) {
          line += div('Ʃ') + div('') + div('');
          for (var v = 0; v < values.length; ++v) {
            var val = values[v].textContent;
            line += div(val > 0 ? val : '', clazzes[v + 3].textContent.replace("small-text", "").trim());
          }
        }
      }

      msg += '<br>';
      msg += div(line, clazz);
      msg += '</div>';
    }
  }

  window.bhv.request.utils.inject(msg, true);
}

function span(txt, clazz, styles) {
  return _tag('span', txt, clazz, styles);
}
function div(txt, clazz, styles) {
  return _tag('div', txt, clazz, styles);
}
function _tag(tagname, txt, clazz, styles) {
  var tag = '<' + tagname;

  if (clazz) {
    tag += ' class="' + clazz + '"';
  }

  if (styles) {
    tag += ' style="' + styles + '"';
  }

  if (!txt || txt === ' ') {
    txt = '&nbsp;';
  }

  return tag + '>' + txt + '</' + tagname + '>';
}

function _logPresenceError(info) {
  log('---------------------------------------------------------------------');
  log('Cannot read presence!');
  log('---------------------------------------------------------------------');
  if (info) {
    log(info);
    log('---------------------------------------------------------------------');
  }
}
  