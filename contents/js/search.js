$(document).ready(function() {
  if (window.location.hash.length > 0) {
    var q = decodeURIComponent(window.location.hash.replace("#", ''));
    $('.overlay').show();
    $('.sort-buttons').show();
    $('input[type=text]').val(q);
    $.post( "http://search.slowtheory.com/q", { 'query' : q })
    .done(function( data ) {
      if (data.length == 0) {
        $('.list').hide();
        $('.alert').show();
      } else {
        $('.list').show();
        $('.alert').hide();
      }
      $.each(data, function(index) {
        var shortened = data[index].summary.replace(/(<([^>]+)>)/ig,"").substr(0,300);
        var re = new RegExp(".*[\.]",'g');
        data[index].preview = shortened.match(re);
        data[index].title_link = '<a href="' + data[index].link + '">' + data[index].title + '</a>';
        data[index].read_more_link = '<a href="' + data[index].link + '">Read more</a>';
        data[index].readable_date = moment(data[index].published_on).format("MMMM Do, YYYY");
      });
      var options = {
        item: 'dummy-item'
      };
      var hackerList = new List('searchresults', options, data);
      $('.overlay').hide();
    });
  }
  $('form').on('submit', function(e) {
    $('.overlay').show();
    $('.sort-buttons').show();
    e.preventDefault();
    var q = $('input[type=text]').val();
    window.location.hash = encodeURIComponent(q);
    $.post( "http://search.slowtheory.com/q", { 'query' : q })
    .done(function( data ) {
      if (data.length == 0) {
        $('.list').hide();
        $('.alert').show();
      } else {
        $('.list').show();
        $('.alert').hide();
      }
      $.each(data, function(index) {
        var shortened = data[index].summary.replace(/(<([^>]+)>)/ig,"").substr(0,300);
        var re = new RegExp(".*[\.]",'g');
        data[index].preview = shortened.match(re);
        data[index].title_link = '<a href="' + data[index].link + '">' + data[index].title + '</a>';
        data[index].read_more_link = '<a href="' + data[index].link + '">Read more</a>';
        data[index].readable_date = moment(data[index].published_on).format("MMMM Do, YYYY");
      });
      var options = {
        item: 'dummy-item'
      };
      var hackerList = new List('searchresults', options, data);
      $('.overlay').hide();
    });
  });
});