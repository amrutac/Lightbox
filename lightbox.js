(function initApp() {
  var httpRequest = new XMLHttpRequest(),
    flickrAPIUrl = 'https://api.flickr.com/services/rest/?',
    params = {
      method: 'flickr.interestingness.getList',
      api_key: '741db81cc8452c30ebc117116850a6cc',
      format: 'json',
      nojsoncallback: 1
    };

  function buildQueryString() {
    var queryString = '';
    for (let key in params) {
      queryString += key + '=' + encodeURIComponent(params[key]) + '&';
    }
    return queryString;
  }

  function buildThumbnailUrl(photo) {
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
      '/' + photo.id + '_' + photo.secret + '_q.jpg';
  }

  function buildLargeImageUrl(photo) {
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
      '/' + photo.id + '_' + photo.secret + '_b.jpg';
  }

  function handleImages() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var photosObj, photosArr, photosLen, photoGalleryDiv;

        photosObj = JSON.parse(httpRequest.responseText).photos;
        photosArr = photosObj.photo;
        photosLen = photosObj.photo.length;
        photoGalleryDiv = document.getElementsByClassName('photo-gallery')[0];

        for (let i = 0; i < photosLen; i++) {
          let url, imgElem;
          url = buildThumbnailUrl(photosArr[i]);
          imgElem = document.createElement('img');
          imgElem.setAttribute('src', url);
          imgElem.className = 'photo';
          imgElem.onclick = expandPhoto(photosArr[i]);
          photoGalleryDiv.appendChild(imgElem);
        }
      } else {
        console.log('There was a problem with the request.');
      }
    }
  }

  function showOverlay(src) {
    var overlayImage = document.getElementById('overlay-image'),
    overlayDiv = document.getElementById('overlay');
    overlayDiv.setAttribute('class', 'overlay');
    overlayImage.setAttribute('src', src);
    overlayImage.setAttribute('class', 'overlay-image');
    overlayImage.onclick = hideOverlay;
  }

  function expandPhoto(photo) {
    return function() {
      showOverlay(buildLargeImageUrl(photo));
    }

  }

  function hideOverlay() {
    var overlayImage = document.getElementById('overlay-image'),
    overlayDiv = document.getElementById('overlay');
    overlayDiv.setAttribute('class', 'hide-overlay');
    overlayImage.setAttribute('src', '');
    overlayImage.setAttribute('class', 'hide-overlay');
  }

  function makeRequest(url) {
    httpRequest.onreadystatechange = handleImages;
    httpRequest.open('GET', url, true);
    httpRequest.send();
  }

  function fetchImages() {
    makeRequest(flickrAPIUrl + buildQueryString());
  }

  fetchImages();
})();