/*** ISOTOPE MODS ***/
$.Isotope.prototype._getCenteredMasonryColumns = function() {
  this.width = this.element.width();
  
  var parentWidth = this.element.parent().width();
  
                // i.e. options.masonry && options.masonry.columnWidth
  var colW = this.options.masonry && this.options.masonry.columnWidth ||
                // or use the size of the first item
                this.$filteredAtoms.outerWidth(true) ||
                // if there's no items, use size of container
                parentWidth;
  
  var cols = Math.floor( parentWidth / colW );
  cols = Math.max( cols, 1 );

  // i.e. this.masonry.cols = ....
  this.masonry.cols = cols;
  // i.e. this.masonry.columnWidth = ...
  this.masonry.columnWidth = colW;
};

$.Isotope.prototype._masonryReset = function() {
  // layout-specific props
  this.masonry = {};
  // FIXME shouldn't have to call this again
  this._getCenteredMasonryColumns();
  var i = this.masonry.cols;
  this.masonry.colYs = [];
  while (i--) {
    this.masonry.colYs.push( 0 );
  }
};

$.Isotope.prototype._masonryResizeChanged = function() {
  var prevColCount = this.masonry.cols;
  // get updated colCount
  this._getCenteredMasonryColumns();
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
  $('.overlay').show();
  $('.loadmore .nextgroup').off('click');
  var next_page = parseInt(current_page) + 1;
  var params = { 'page' : next_page, 'pageSize' : 60, 'returnSizes' : '200x200xCR,1024x1024' };
  if (window.location.hash) { params.tags = window.location.hash.replace("#!/", ''); }
  
  $.post('http://photos.slowtheory.com/list', params)
  .done(function(data) {
    // Disable the load more button if there aren't any results
    if (data.result.length == 0) { $('.loadmore .nextgroup').addClass('disabled'); }
    var html_buffer = '';
    // Buffer HTML for newly loaded items
    $.when($.each(data.result, function(index, value) {
      var title_string = '';
      if (value.description != null) {
        var title_string = 'title="' + value.description + '"';
      }
      html_buffer = html_buffer + '<div class="isotope-item"><a class="fancybox" rel="gallery" href="' + value.path1024x1024 + '" ' + title_string + '><img src="' + value.path200x200xCR + '" alt="' + value.title + '"></a></div>';
    // Add the items
    })).then(function() {
      var $newItems = $(html_buffer);
      $('.post').isotope( 'insert', $newItems );
    	$(".post .fancybox").fancybox({
        helpers : {
          title : {
    	      type : 'inside'
          }
        },
    		openEffect	: 'none',
    		closeEffect	: 'none'
    	});
    	$('.overlay').hide();
    });
  });
  $('.loadmore .nextgroup').on('click', function() { loadNext(next_page); });
  return true;
}



$('document').ready(function() {
  $.getJSON('http://photos.slowtheory.com/list/tags', function(data) {
    // Sort tags & build tag list
    var sorted = data.result.sort(function(obj1, obj2) { return obj2.count - obj1.count; });
    $.each(sorted, function(i,obj) {
      var class_active = '';
      if (window.location.hash.replace("#!/", '') == obj.id) { class_active = ' active'; }
      $('.list-group').append('<li class="list-group-item' + class_active + '"><span class="badge">' + obj.count + '</span><a href="#!/' + obj.id + '">' + obj.id + '</a></li>')
    });
    // Add click handlers for tags
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