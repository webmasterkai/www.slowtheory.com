module.exports = function(html) {
  var shortened = html.replace(/(<([^>]+)>)/ig,"").substr(0,300);
  var re = new RegExp(".*[\.]",'g');
  return shortened.match(re);
}
