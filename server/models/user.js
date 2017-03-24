// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  role: { type: String, enum: ['admin', 'client', 'driver'] },
  userID: String,
  password: String,
  name: String,
  emailid: String,
  phone: String,
  address: String,
  //driver details
  drvLicNo: String,
  drvLicExpDt: String,
  drvExperiance: String,
  //cab details for driver
  cabNo: String,
  cabOwner: String,
  cabMake: String,
  cabTariffID:String
});

module.exports = mongoose.model('user', User,'user');