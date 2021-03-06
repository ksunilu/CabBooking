var mongoose = require('mongoose');

// var tariffSchema = require('./tariffs.js');
// var userSchema = require('./users.js');

var bookSchema = mongoose.Schema({
  bookDate: { type: Date, default: Date() },
  bookCustID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  bookSource: String,
  bookDestination: String,
  bookUser: {},
  bookVehicleType: {},
  bookedCab: {},
  bookTravelDate: Date,
  bookDistance: Number,
  bookStatus: {
    type: String, enum: ['Booked', 'Riding', 'Waiting', 'Reached',
      'Cancelled', 'booked', 'riding', 'waiting', 'reached', 'cancelled'], default: 'booked'
  },
  checkIncabdrvID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  checkInMeter: Number,
  checkOutMeter: Number,
  checkInDate: Date,
  checkOutDate: Date,
  billTariff: Number,
  totalFare: Number,
  billChargesText: String,
  billChargesValue: Number,
  billTax: Number,
  billTotal: Number,
  pmtMode: { type: String, enum: ['Cash', 'cash', 'Credit Card', 'credit card', 'Cab Money', 'cab money'] }
}
  ,
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Bookings', bookSchema, 'Bookings');
