/* FUNCTION TO LOAD THE NEXT GROUP OF IMAGES */
function load_photos(current_page, template) {
  // Show the overlay and disable
  $('.overlay').show();
  $('.loadmore .nextgroup').off('click');
  var next_page = parseInt(current_page) + 1;
  var params = { 'page' : next_page, 'pageSize' : 60, 'returnSizes' : '300x300xCR,1024x1024' };
  if (window.location.hash) { params.tags = window.location.hash.replace("#!/", ''); }

  // Get a list of files from trovebox
  $.getJSON('http://www.slowtheory.com/list', params, function(data) {
    if (data.result.length == 0) { $('.loadmore .nextgroup').addClass('disabled'); }
    var html = template(data);
    $.when($('#photos .list').html($(html))).then(function() {
      $("img.lazy").show().lazyload({
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
    $('.overlay').hide();
    $('html, body').animate({ scrollTop: $('body').offset().top }, 0);
  });
  return true;
}

$('document').ready(function() {
  var template = Handlebars.compile('{{#each result}}<li class="col-sm-3 col-xs-6"><a class="fancybox" rel="gallery" href="{{path1024x1024}}"><img class="img-responsive lazy" src="/assets/media/black.png" data-original="{{path300x300xCR}}" alt="{{title}}" title="{{description}}"></a></li>{{/each}}');
  load_photos(0,template);
  // $(window).on('hashchange', function() {
  //   $('html, body').animate({ scrollTop: $('body').offset().top }, 500);
  //   load_photos(0,template);
  // });
});