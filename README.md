# Lightbox
Lightbox app with Flickr API

## URL
[Lightbox](http://www.amrutac.com/Lightbox/)

## Notes
This is a lightbox app that queries the [Flickr API](https://www.flickr.com/services/api/flickr.interestingness.getList.html) to retrieve a list of most interesting photos and sets
thumbnails for the gallery.

Clicking on individual thumbnail opens the overlay containing
the image in [large size](https://www.flickr.com/services/api/flickr.photos.getSizes.html) with the title in addition to  Previous, Next and Close buttons to navigate between photos and close the overlay.

The overlay is implemented by showing the previously downloaded thumbnail blurred out in the beginning and displays the large image after it's has finished loading.

The site is responsive.

Show more button displays the next page of the result set.

##Pending wishlist
* Set up grunt/gulp to minify JavaScript, CSS and HTML files
* Infinite scroll
* Tests
* Use geo-data for photos to show locations on map
