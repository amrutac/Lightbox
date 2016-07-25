(function(document, window) {
  'use strict';
  function hideOverlay() {
    var overlayDiv = Utility.$('#overlay');
    overlayDiv.setAttribute('class', 'hide');
  }

  function handleResponse(response, err) {
    var errorDiv = Utility.$('.error');
    if (response) {
      this.photos = JSON.parse(response).photos.photo;
      errorDiv.classList.add('hide');
      this.processThumbnailImages();
    } else if (err) {
      errorDiv.classList.remove('hide');
    }

  }

  function thumbnailClickHandler(index, gallery) {
    return function() {
      gallery.showOverlay(index);
    };
  }

  function lazyLoadImage() {
    var imgOverlayElem = Utility.$('.overlay-image'),
      placeholderElem = Utility.$('.overlay-image-placeholder');

      placeholderElem.className = 'overlay-image-placeholder no-opacity';
      imgOverlayElem.className = 'overlay-image full-opacity';
  }

  function togglePrevNext(index, prev, next, photosCount) {
    if (index === 0) {
      prev.classList.toggle('hide');
    } else {
      prev.classList.remove('hide');
    }

    if (index === photosCount - 1) {
      next.classList.toggle('hide');
    } else {
      next.classList.remove('hide');
    }
  }

  function Gallery() {
    this.currentImageIndex = null;
    this.photos = [];

    //Keyboard events
    document.addEventListener('keydown', this.keyDownHandler.bind(this));
    document.addEventListener('keydown', this.keyUpHandler.bind(this));
  }

  Gallery.prototype.keyDownHandler = function(event) {
    if(event.keyCode === 37) {
      this.showPrevImage();
    }

    if(event.keyCode === 39) {
      this.showNextImage();
    }

  }

  Gallery.prototype.keyUpHandler = function(event) {
    if(event.keyCode === 13 || event.keyCode === 32) {
      this.showNextImage();
    }

    if(event.keyCode === 27) {
      hideOverlay();
    }
  }


  Gallery.prototype.load = function() {
    Utility.makeFlickrRequest(handleResponse, this);
  };

  Gallery.prototype.processThumbnailImages = function() {
    var i, photosLen, photoGalleryDiv;
    if (this.photos) {
      photosLen = this.photos.length;
      photoGalleryDiv = Utility.$('.photo-gallery');

      for (i = 0; i < photosLen; i++) {
        var url, imgElem;

        url = Utility.buildThumbnailUrl(this.photos[i]);
        imgElem = document.createElement('img');
        imgElem.className = 'thumbnail';
        imgElem.setAttribute('src', url);
        imgElem.addEventListener('click', thumbnailClickHandler(i, this));
        photoGalleryDiv.appendChild(imgElem);
      }
    }
  };

  Gallery.prototype.showOverlay = function(index) {
    var photo,
      overlayImageWrapper,
      prev,
      next,
      close,
      overlayDiv,
      imgOverlayElem,
      titleElem,
      placeholderElem;

    this.currentImageIndex = index;
    photo = this.photos[index];

    overlayImageWrapper = Utility.$('.overlay-image-wrapper');
    prev = Utility.$('.previous');
    next = Utility.$('.next');
    close = Utility.$('.close');
    overlayDiv = Utility.$('#overlay');
    imgOverlayElem = Utility.$('.overlay-image');
    titleElem = Utility.$('.overlay-image-title');
    placeholderElem = Utility.$('.overlay-image-placeholder');

    overlayDiv.setAttribute('class', 'overlay');

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

    togglePrevNext(index, prev, next, this.photos.length);

    imgOverlayElem.className = 'overlay-image no-opacity';
    placeholderElem.className = 'overlay-image-placeholder full-opacity';

    imgOverlayElem.setAttribute('src', Utility.buildLargeImageUrl(photo));
    placeholderElem.setAttribute('src', Utility.buildThumbnailUrl(photo));
    titleElem.textContent = photo.title;

    prev.onclick = this.showPrevImage.bind(this);
    next.onclick = this.showNextImage.bind(this);
    close.onclick = hideOverlay;
  };

  Gallery.prototype.showNextImage = function() {
    this.showOverlay(++this.currentImageIndex);
  };

  Gallery.prototype.showPrevImage = function() {
    this.showOverlay(--this.currentImageIndex);
  };

  window.Gallery = Gallery;
})(document, window);