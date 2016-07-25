(function(document, window) {
  'use strict';

  var settings;

  settings = {
    basePath: 'https://api.flickr.com/services/rest/?',
    params: {
      method: 'flickr.interestingness.getList',
      api_key: '741db81cc8452c30ebc117116850a6cc',
      format: 'json',
      nojsoncallback: 1
    }
  };

  function buildQueryString() {
    var queryString = '', key, params = settings.params;

    for (key in params) {
      queryString += key + '=' + encodeURIComponent(params[key]) + '&';
    }
    return queryString;
  }

  function makeFlickrRequest(callback, context) {
    var url, httpRequest;

    httpRequest = new XMLHttpRequest();
    url = settings.basePath + buildQueryString();
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          callback.call(context, httpRequest.responseText, null);
        } else {
          callback.call(context, null, httpRequest.status);
        }
      }
    };
    httpRequest.open('GET', url, true);
    httpRequest.send();
  }

  function buildUrl(photo, photoSize) {
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
      '/' + photo.id + '_' + photo.secret + photoSize + '.jpg';
  }

  function buildThumbnailUrl(photo) {
    return buildUrl(photo, '_q');
  }

  function buildLargeImageUrl(photo) {
    return buildUrl(photo, '_b');
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  window.Utility = {
    makeFlickrRequest: makeFlickrRequest,
    buildThumbnailUrl: buildThumbnailUrl,
    buildLargeImageUrl: buildLargeImageUrl,
    $: $
  };
})(document, window);