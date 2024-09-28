if (window.bhv === undefined) {
  window.bhv = {};
}

if (window.bhv.elements === undefined) {
  window.bhv.elements = {}
}

if (window.bhv.elements.expander === undefined) {
  window.bhv.elements.expander = {

    init: function(idsExpander, keepOpen) {
      var i;
      // get anchor
      var keyOpen = window.location.hash;
      if (keyOpen && keyOpen[0] === '#') {
        keyOpen = keyOpen.substring(1);
      }

      // hande each expander
      for (i = 0; i < idsExpander.length; ++i) {

        // // header
        // var id = idsExpander[i],
        //     id2 = id + '_2';
        // var header = document.getElementById(id);
        // var div = document.getElementById(id2);
        // if (div && header && header.className.indexOf('expandable') > -1) {
        //   header.insertAdjacentHTML('beforeend', '<div class="' + clazz + '">&nbsp;</div>');
        //   this._addEvent(header, 'click', handler);
        //
        //   if (keyOpen && keepOpen && keepOpen[id] && keepOpen[id].indexOf(keyOpen) > -1) {
        //     this._addClass(header, 'up');
        //   } else {
        //     // hide container to hide and show
        //     div.style.display = 'none';
        //   }
        // }
        this._initExpander(idsExpander[i], keyOpen, keepOpen);
      }
    },

    initOV: function() {
      var i, i2, elems = document.querySelectorAll('.expandable'),
          ids = [], id, idCont, keepOpen = {}, parent;

      // collect all header
      for (i = 0, i2 = elems.length; i < i2; ++i) {
        id = elems[i].id;
        if (typeof(id) === 'string' && id.length > 0) {
          ids.push(id);
        }
      }

      // collect all links
      elems = document.querySelectorAll('a');
      for (i = 0, i2 = elems.length; i < i2; ++i) {
        // has this link an id?
        id = elems[i].id;
        if (typeof(id) === 'string' && id.length > 0) {
          // handle all parents, that have class expanded_container
          parent = elems[i].parentNode;
          while (parent != null) {

            // handle each parent container
            if (this._hasClass(parent, 'expanded_container')) {
              // get id and create tree of ids to open
              idCont = parent.id;
              if (typeof(idCont) === 'string' && idCont.length > 2) {
                idCont = idCont.substring(0, idCont.length - 2);
                if (keepOpen[idCont] === undefined) {
                  keepOpen[idCont] = [id];
                } else {
                  keepOpen[idCont].push(id);
                }
              }
            }

            parent = parent.parentNode;
          }
        }
      }

      this.init(ids, keepOpen);
    },

    _initExpander: function(id, keyOpen, keepOpen) {
      // header and region to show and hide
      var clazz = 'expander';
      var id2 = id + '_2';
      var header = document.getElementById(id);
      var div = document.getElementById(id2);
      if (div && header && header.className.indexOf('expandable') > -1) {
        header.insertAdjacentHTML('beforeend', '<div class="' + clazz + '">&nbsp;</div>');
        this._addEvent(header, 'click');

        // open or close region
        if (keyOpen && keepOpen && keepOpen[id] && keepOpen[id].indexOf(keyOpen) > -1) {
          this._addClass(header, 'up');
        } else {
          // hide container to hide and show
          div.style.display = 'none';
        }
      }
    },

    eventhandler: function(event) {
      var header = event.target;
      if (header) {
        var id = header.id;
        if (!id) {
          header = header.parentNode;
          if (header) {
            id = header.id;
          }
        }
        if (id) {
          var id2 = id + '_2',
              div = document.getElementById(id2);
          if (div) {
            var show = div.style.display == 'none';
            show
              ? window.bhv.elements.expander._addClass(header, 'up')
              : window.bhv.elements.expander._removeClass(header, 'up');
            div.style.display = show ? 'block' : 'none';
          }
        }
      }

      return false;
    },

    _addEvent: function(elem, event) {
      if (elem.addEventListener) {
        elem.addEventListener(event, this.eventhandler); //, false);
      } else if (elem.attachEvent)  {
        elem.attachEvent('on' + event, function(ev) {
          if (!ev) ev = window.event;
          if (ev.target == undefined) {
            ev.target = ev.srcElement;
          }
          this.eventhandler(ev);
        });
      }
    },

    _addClass: function(elem, clazz) {
      if (elem && !this._hasClass(elem, clazz)) {
        elem.className += ' ' + clazz;
      }
    },

    _removeClass: function(elem, clazz) {
      var anyClass = false,
          parts, pos;

      if (elem && elem.className) {
        parts = elem.className.split(' ');
        if (parts) {
          while (-1 < (pos = parts.indexOf(clazz))) {
            anyClass = true;
            parts.splice(pos, 1);
          }
          if (anyClass) {
            elem.className = parts.join(' ');
          }
        }
      }

      return false;
    },

    _hasClass: function(elem, clazz) {
      var parts;

      if (elem && elem.className) {
        parts = elem.className.split(' ');
        if (parts) {
          return parts.indexOf(clazz) > -1;
        }
      }

      return false;
    }
  }
}
