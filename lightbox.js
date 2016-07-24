(function initApp() {
  var httpRequest = new XMLHttpRequest(),
    currentImageIndex = null,
    photosArr = [],
    flickrAPIUrl = 'https://api.flickr.com/services/rest/?',
    params = {
      method: 'flickr.interestingness.getList',
      api_key: '741db81cc8452c30ebc117116850a6cc',
      format: 'json',
      nojsoncallback: 1
    };

  function buildQueryString() {
    var queryString = '', key;
    for (key in params) {
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
    var i;

    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var photosObj, photosLen, photoGalleryDiv;

        photosObj = JSON.parse(httpRequest.responseText).photos;
        photosArr = photosObj.photo;
        photosLen = photosObj.photo.length;
        photoGalleryDiv = document.getElementsByClassName('photo-gallery')[0];

        for (i = 0; i < photosLen; i++) {
          var url, imgElem;
          url = buildThumbnailUrl(photosArr[i]);
          imgElem = document.createElement('img');
          imgElem.setAttribute('src', url);
          imgElem.className = 'thumbnail';
          imgElem.onclick = expandPhoto(i);
          photoGalleryDiv.appendChild(imgElem);
        }
      } else {
        console.log('There was a problem with the request.');
      }
    }
  }

  function showOverlay(src) {
     var overlayImage = document.getElementById('overlay-image'),
      prev = document.getElementsByClassName('previous')[0],
      next = document.getElementsByClassName('next')[0],
      close = document.getElementsByClassName('close')[0],
      overlayDiv = document.getElementById('overlay');

    overlayDiv.setAttribute('class', 'overlay');
    overlayImage.setAttribute('src', src);
    overlayImage.setAttribute('class', 'overlay-image');
    prev.onclick = showPrevImage;
    next.onclick = showNextImage;
    close.onclick = hideOverlay;
  }

  function showNextImage() {
    var setupOverlay = expandPhoto(++currentImageIndex);
    setupOverlay();
  }

  function showPrevImage() {
    var setupOverlay = expandPhoto(--currentImageIndex);
    setupOverlay();
  }

  function expandPhoto(index) {
    return function() {
      var photo = photosArr[index];
      console.log(photo)
      currentImageIndex = index;
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