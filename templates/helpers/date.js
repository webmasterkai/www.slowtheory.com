var moment = require('moment');

module.exports = function(date) {
  date_format = "MMMM Do, YYYY";
  return moment(date).format(date_format);
}
