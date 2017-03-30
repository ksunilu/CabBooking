
module.exports = function (app) {

  var userCrud = require('./userCrud');
  userCrud(app);


  var crud = require('./crud');
  crud(app, 'tariffs');


  console.log('Routes Created');
  
}
