var mongoose = require('mongoose');
var schema = mongoose.Schema({
  tariffID: String,
  tariffVehicleType: String,
  baseTariff: String,
  peakTariff: String
});
module.exports = mongoose.model('Tariffs2', schema, 'Tariffs2');
