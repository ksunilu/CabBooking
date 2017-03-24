
module.exports = function (app) {
  var crudRoute = require('./crudRoute');
  crudRoute(app, 'tariffs');
  crudRoute(app, 'tariffs2');
}
