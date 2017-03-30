// user model
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  role: { type: String, enum: ['admin', 'client', 'driver'] },
  userID: String,
  password: String,
  name: String,
  email: String,
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
  cabTariffID: String
});

//Encrypting Password
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//Decrypting Password
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
}



module.exports = mongoose.model('Users', UserSchema, 'Users');
