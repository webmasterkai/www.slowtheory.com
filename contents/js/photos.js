/* STUFF FOR THE /PHOTOS PAGE */
// Tweaked form of Isotope gutters hack ( https://gist.github.com/2574891 ) and 
//     centered masonry hack (http://isotope.metafizzy.co/custom-layout-modes/centered-masonry.html )
//
// No guarantees; there are even @todos and FIXMEs in here. This is just what I cobbled together
//     for a particular project, and I only tweaked it enough to be sure it worked on that project.

$.Isotope.prototype._getMasonryGutterColumns = function() {
  // Tweak: Renamed call of this.options.masonry to this.options (not sure why it was wrong in example)
  var gutter = this.options.gutterWidth || 0;

  var $parent = this.element.parent();

  // It's ugly, but this hides the slides and gets the parent width *before* slides, for comparison
  // Not always necessary, but was in some instances
  this.element.hide();
  containerWidth = $parent.width();
  this.element.show();

  
  this.masonry.columnWidth = this.options && this.options.columnWidth ||
    // Or use the size of the first item
    this.$filteredAtoms.outerWidth(true) ||
    // If there's no items, use size of container
    containerWidth;

  this.masonry.columnWidth += gutter;
  containerWidth += gutter;

  this.masonry.cols = Math.floor(containerWidth / this.masonry.columnWidth);
  this.masonry.cols = Math.max(this.masonry.cols, 1);
};

$.Isotope.prototype._masonryReset = function() {
  // layout-specific props
  this.masonry = {};
  
  // FIXME shouldn't have to call this again
//  this._getCenteredMasonryColumns();  // Might not need it with the new, simpler gutters code
  this._getMasonryGutterColumns();
  
  var i = this.masonry.cols;
  this.masonry.colYs = [];
  while (i--) {
    this.masonry.colYs.push( 0 );
  }
};

$.Isotope.prototype._masonryResizeChanged = function() {
  var prevColCount = this.masonry.cols;
  // get updated colCount
  this._getMasonryGutterColumns();

  return ( this.masonry.cols !== prevColCount );
};

$.Isotope.prototype._masonryGetContainerSize = function() {
  var unusedCols = 0,
    i = this.masonry.cols;
  // count unused columns
  while ( --i ) {
    if ( this.masonry.colYs[i] !== 0 ) {
      break;
    }
  unusedCols++;
  }

  return {
    height : Math.max.apply( Math, this.masonry.colYs ),
      // fit container to columns that have been used;
      // @todo: Do we need to subtract one gutter to even it out? Nope, that cuts off the shadows.
      // @todo: Some how we need to make it so there's half a left gutter added to the element with left-padding.
    width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
  };
};

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
      $('#photoTags').modal('hide');
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