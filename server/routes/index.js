
module.exports = function (app) {

  var userCrud = require('./userCrud');
  userCrud(app);

  var crud = require('./crud');
  crud(app, 'tariffs');
  crud(app, 'bookings');

  console.log('Routes Created');

}
