var mongoose = require('mongoose');
var TariffsSchema = mongoose.Schema({
  tariffID: String,
  tariffVehicleType: String,
  baseTariff: String,
  peakTariff: String
});
module.exports = mongoose.model('Tariffs', TariffsSchema, 'Tariffs');
