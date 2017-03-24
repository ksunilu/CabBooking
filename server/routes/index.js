
module.exports = function (app) {
  var crudRoute = require('./crud');
  crudRoute(app, 'tariffs');
  crudRoute(app, 'user');
}
