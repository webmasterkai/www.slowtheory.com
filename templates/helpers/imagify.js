module.exports = function(html) {
  var re = new RegExp("img src=\"([^\"]+)\"([^>]*>)",'g');
  if (html.match(re, 'g') != null) {
    new RegExp("src=\"([^\"]+)","g");
    return html.match(re, 'g')[0].replace(re, "<img src=\"/assets/media/t.png\" class=\"lazy img-responsive\" data-original=\"$1\"$2<noscript><img src=\"$1\" alt=\"Enable javascript for faster image loading.\"></noscript>").replace(/http:\/\/([^\/]+)[\/]([^"]+)/, "http://$1.img.labori.us/c350x250/$2");
  }
  return '<div class="no-photo"><i class="fa fa-pencil-square-o fa-5x"></i></div>';
}
