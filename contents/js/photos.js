/* STUFF FOR THE /PHOTOS PAGE */

$.Isotope.prototype.flush = function() {
  this.$allAtoms = $();
  this.$filteredAtoms = $();
  this.element.children().remove();
  this.reLayout();
};

/* FUNCTION TO LOAD THE NEXT GROUP OF IMAGES */
function loadNext(current_page) {
  $.blockUI({ css: { 
    border: 'none', 
    padding: '15px', 
    backgroundColor: '#000', 
    '-webkit-border-radius': '10px', 
    '-moz-border-radius': '10px', 
    opacity: .7, 
    color: '#fff' 
  } }); 
  $('.loadmore .nextgroup').off('click');
  var next_page = parseInt(current_page) + 1;
  var params = { 'page' : next_page, 'pageSize' : 36, 'returnSizes' : '280x280xCR,1024x1024' };
  if (window.location.hash) { params.tags = window.location.hash.replace("#!/", ''); }
  $.post('http://photos.slowtheory.com/list', params)
  .done(function(data) {
    if (data.result.length == 0) {
      $('.loadmore .nextgroup').addClass('disabled');
    }
    $.when($.each(data.result, function(index, value) {
      var $newItem = $('<div class="isotope-item thumbnail"><a class="fancybox" rel="gallery" href="' + value.path1024x1024 + '" title="' + value.description + '"><img src="' + value.path280x280xCR + '" alt="' + value.title + '"></a></div>');
      $('.post').isotope( 'insert', $newItem );
    })).then(function() {
    	$(".fancybox").fancybox({
        helpers : {
          title : {
    	      type : 'inside'
          }
        },
    		openEffect	: 'none',
    		closeEffect	: 'none'
    	});
    	$.unblockUI();
      $(function () {
        $.scrollUp({
          scrollName: 'scrollUp',
          scrollDistance: 200,
          scrollFrom: 'top',
          scrollSpeed: 300,
          easingType: 'linear',
          animation: 'fade',
          animationInSpeed: 200,
          animationOutSpeed: 200,
          scrollText: 'Scroll to top', 
          scrollTitle: false, 
          scrollImg: false, 
          activeOverlay: false, 
          zIndex: 2147483647 
        });
      });
    });
  });
  $('.loadmore .nextgroup').on('click', function() { loadNext(next_page); });
  return true;
}

/* DO THE FOLLOWING ON DOCUMENT READY */
$('document').ready(function() {
  $.getJSON('http://photos.slowtheory.com/list/tags', function(data) {
    var sorted = data.result.sort(function(obj1, obj2) {
      return obj2.count - obj1.count;
    });
    $.each(sorted, function(i,obj) {
      var class_active = '';
      if (window.location.hash.replace("#!/", '') == obj.id) { class_active = ' active'; }
      $('.list-group').append('<li class="list-group-item' + class_active + '"><span class="badge">' + obj.count + '</span><a href="#!/' + obj.id + '">' + obj.id + '</a></li>')
    });
    $('.list-group-item').on('click',function() {
      $('.list-group-item').removeClass('active');
      $(this).addClass('active');
      $('.loadmore .nextgroup').removeClass('disabled');
      window.location.hash = $(this).find('a').attr('href');
    });
  });
  $('.post').isotope({ itemSelector : '.isotope-item' });
  loadNext(0);
  $(window).on('hashchange', function() {
    $('html, body').animate({ scrollTop: $('body').offset().top }, 500);
    $('.post').isotope('flush');
    loadNext(0);
  });
});