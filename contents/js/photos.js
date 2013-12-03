/* FUNCTION TO LOAD THE NEXT GROUP OF IMAGES */
function load_photos(current_page, template) {
  // Show the overlay and disable
  $('.overlay').show();
  if (window.location.hash) { current_page = parseInt(window.location.hash.replace("#", '')); }

  var next_page = parseInt(current_page) + 1;
  var previous_page = parseInt(current_page) - 1;
  var params = { 'page' : current_page, 'pageSize' : 60, 'returnSizes' : '300x300xCR,1024x1024' };

  // Get a list of files from trovebox
  $.getJSON('http://www.slowtheory.com/list', params, function(data) {
    var html = template(data);
    $.when($('#photos .list').html($(html))).then(function() {
      // Lazyload the thumbnails
      $("img.lazy").show().lazyload({
        skip_invisible : false
      });
      // Add fancyboxes to the thumbs
      $("#photos .list .fancybox").fancybox({
          helpers : {
            title : {
             type : 'inside'
            }
          },
         openEffect  : 'none',
         closeEffect : 'none'
      });
      // Simulate scrolling to trigger lazyload
      $('html,body').trigger("scroll");
      $(window).resize(function() {
        $("img.lazy").show().lazyload();
      });
    });
    // Hide the overlay after we've loaded in the new images
    $('.overlay').hide();
    // Scroll to the top of the page
    $('html, body').animate({ scrollTop: $('body').offset().top }, 0);
    // If we have more total rows than what is shown, enable the button
    if (data.result[0].totalRows > (60 * next_page)) {
      $('.nextpage').removeClass('disabled');
      $('.nextpage').find('a').attr('href', '/photos/#' + next_page);
    } else {
      $('.nextpage').addClass('disabled');
    }
    // If we aren't on the first page, allow us to go back
    if (current_page > 1) {
      $('.prevpage').removeClass('disabled');
      $('.prevpage').find('a').attr('href', '/photos/#' + previous_page);    
    } else {
      $('.prevpage').addClass('disabled');
    }
  });
  return true;
}

$('document').ready(function() {
  // Compile the template for list items
  var template = Handlebars.compile('{{#each result}}<li class="col-sm-3 col-xs-6"><a class="fancybox" rel="gallery" href="{{path1024x1024}}"><img class="img-responsive lazy" src="/assets/media/black.png" data-original="{{path300x300xCR}}" alt="{{title}}" title="{{description}}"></a></li>{{/each}}');
  // Load the initial set of photos
  load_photos(1,template);
  // On hash change, load the new group of photos
  $(window).on('hashchange', function() {
    load_photos(window.location.hash.replace("#", ''),template);
    $('html, body').animate({ scrollTop: $('body').offset().top }, 500);
  });
});