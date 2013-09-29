module.exports = function(html) {
  var re = /img src="([^"]+)"/g;
  return html.replace(re, "img src=\"/assets/media/grey.gif\" class=\"lazy img-responsive\" data-original=\"$1\"$2<noscript><img src=\"$1\" alt=\"Enable javascript for faster image loading.\"></noscript>");
}
