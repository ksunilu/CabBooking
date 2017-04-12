// user model
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    role: { type: String, enum: ['admin', 'client', 'driver', 'Admin', 'Client', 'Driver', 'Customer', 'customer'] },
    email: String,
    password: String,
    name: String,
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
    cabTariffID: String,
    // loginStatus & Location
    status: { type: String, enum: ['login', 'Login', 'Logoff', 'logoff', 'inactive', 'Inactive'] },
    statusTime: { type: Date, default: Date() },
    statuslocation: String
  },
  {
    timestamps: true
  }
);

//Encrypting Password
UserSchema.methods.generateHash = function (password) {
  var rval = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  console.log(rval);
  return rval;

}

//Decrypting Password
UserSchema.methods.validPassword = function (password) {
  console.log('Decrypting Password');
  var rval = bcrypt.compareSync(password, this.password);
  console.log(rval);
  return rval;
}

module.exports = mongoose.model('Users', UserSchema, 'Users');
