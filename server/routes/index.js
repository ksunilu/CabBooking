
module.exports = function (app) {
  var crudRoute = require('./crud');
  crudRoute(app, 'tariffs');
  crudRoute( app, 'users');
  console.log('Routes Created');
}
