var mongoose = require('mongoose');
var TariffsSchema = mongoose.Schema({
  tariffVehicleType: String,
  bookingFee:Number,
  baseTariff: Number,
  peakTariff: Number,
  cancellationFee: Number
});
module.exports = mongoose.model('Tariffs', TariffsSchema, 'Tariffs');
