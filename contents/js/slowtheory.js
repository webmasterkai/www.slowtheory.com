$('document').ready(function() {
  /*** LAZYLOAD -- initialize lazy loading images ***/
  $("img.lazy").show().lazyload({
    effect : "fadeIn"
  });
});