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

  function lazyLoadImage() {
    var imgOverlayElem = document.getElementsByClassName('overlay-image')[0],
      placeholderElem = document.getElementsByClassName('overlay-image-placeholder')[0];

      placeholderElem.className = 'overlay-image-placeholder no-opacity';
      imgOverlayElem.className = 'overlay-image full-opacity';
  }

  function togglePrevNext(index, prev, next) {
    if (index === 0) {
      prev.classList.toggle('hide');
    } else {
      prev.classList.remove('hide');
    }

    if (index === photosArr.length - 1) {
      next.classList.toggle('hide');
    } else {
      next.classList.remove('hide');
    }
  }

  function showOverlay(photo, index) {
     var overlayImageWrapper = document.getElementsByClassName('overlay-image-wrapper')[0],
      prev = document.getElementsByClassName('previous')[0],
      next = document.getElementsByClassName('next')[0],
      close = document.getElementsByClassName('close')[0],
      overlayDiv = document.getElementById('overlay'),
      imgOverlayElem, titleElem, placeholderElem;

    overlayDiv.setAttribute('class', 'overlay');
    imgOverlayElem = document.getElementsByClassName('overlay-image')[0];
    titleElem = document.getElementsByClassName('overlay-image-title')[0];
    placeholderElem = document.getElementsByClassName('overlay-image-placeholder')[0];

    if (!imgOverlayElem) {
      //placeholder
      placeholderElem = document.createElement('img');
      overlayImageWrapper.appendChild(placeholderElem);

      imgOverlayElem = document.createElement('img');
      imgOverlayElem.onload = lazyLoadImage;
      overlayImageWrapper.appendChild(imgOverlayElem);

      titleElem = document.createElement('span');
      titleElem.className = 'overlay-image-title';
      overlayImageWrapper.appendChild(titleElem);
    }

    togglePrevNext(index, prev, next);

    imgOverlayElem.className = 'overlay-image no-opacity';
    placeholderElem.className = 'overlay-image-placeholder full-opacity';

    imgOverlayElem.setAttribute('src', buildLargeImageUrl(photo));
    placeholderElem.setAttribute('src', buildThumbnailUrl(photo));
    titleElem.textContent = photo.title;

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
      currentImageIndex = index;
      showOverlay(photo, index);
    }
  }

  function hideOverlay() {
    var overlayImage = document.getElementById('overlay-image'),
    overlayDiv = document.getElementById('overlay');
    overlayDiv.setAttribute('class', 'hide');
  }

  function makeRequest(url) {
    httpRequest.onreadystatechange = handleImages;
    httpRequest.open('GET', url, true);
    httpRequest.send();
  }

  function fetchImages() {
    makeRequest(flickrAPIUrl + buildQueryString());
  }

  //Keyboard events
  document.addEventListener('keydown', function(event) {
    if(event.keyCode === 37) {
      showPrevImage();
    }

    if(event.keyCode === 39) {
      showNextImage();
    }
  });

  document.addEventListener('keydown', function(event) {
    if(event.keyCode === 13 || event.keyCode === 32) {
      showNextImage();
    }

    if(event.keyCode === 27) {
      hideOverlay();
    }
  });

  fetchImages();
})();