(function(document, window) {
  'use strict';

  function init() {
    var gallery = new Gallery();
    gallery.load();
  }

  window.Lightbox = {
    init: init
  }
})(document, window);

Lightbox.init();