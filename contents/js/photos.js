$(document).ready(function() {
  var options = {
    valueNames: ['name', 'tags'],
    page : 48
  };
  var photolist = new List('photos', options);
  // When the list is updated, we need to rework the pager buttons
  photolist.on('updated', function() {
    $('.prevpage, .nextpage').removeClass('disabled');
    $('.nextpage').off('click touch').on('click touch', function(e) {
      console.log(parseInt(photolist.i)+parseInt(photolist.page), parseInt(photolist.page));
      photolist.show(parseInt(photolist.i)+parseInt(photolist.page), parseInt(photolist.page));
    });
    $('.prevpage').off('click touch').on('click touch', function(e) {
      console.log(parseInt(photolist.i)-parseInt(photolist.page), parseInt(photolist.page));
      photolist.show(parseInt(photolist.i)-parseInt(photolist.page), parseInt(photolist.page));
    });
    // If our position is less than the number of entries per page, assume we are on page #1
    if (parseInt(photolist.i) < parseInt(photolist.page)) {
      $('.prevpage').addClass('disabled').off('click touch');
    }
    // If our position plus the size of the page is greater than length, we're showing the last entries
    if ((parseInt(photolist.i) + parseInt(photolist.page)) > photolist.matchingItems.length) {
      $('.nextpage').addClass('disabled').off('click touch');
    }
    $("img.lazy").show().lazyload({
      effect: 'fadeIn',
      skip_invisible : false
    });
    $("#photos .list .fancybox").fancybox({
        helpers : {
          title : {
           type : 'inside'
          }
        },
       openEffect  : 'none',
       closeEffect : 'none'
    });
    $('html,body').trigger("scroll");
    $(window).resize(function() {
      $("img.lazy").show().lazyload();
    });
  });
  photolist.update();
});