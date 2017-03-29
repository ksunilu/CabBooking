
module.exports = function () {
  var crudRoute = require('./crud');
  crudRoute( 'tariffs');
  crudRoute( 'users');
  console.log('Routes Created');
}
