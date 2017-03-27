
module.exports = function () {
  var crudRoute = require('./crud');
  crudRoute( 'tariffs');
  crudRoute( 'user');
}
