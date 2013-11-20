$('document').ready(function() {
  /*** LAZYLOAD -- initialize lazy loading images ***/
  $("img.lazy").show().lazyload({
    effect : "fadeIn"
  });
  $(window).resize(function() {
    $("img.lazy").show().lazyload();
  });
  // $.ga.load("UA-37502202-1");
});