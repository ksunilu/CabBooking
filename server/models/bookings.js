var mongoose = require('mongoose');
var bookSchema = mongoose.Schema({
  bookDateTime: { type: Date, default: Date() },
  bookCustID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  bookSource: String,
  bookDestination: String,
  bookTravelDateTime: Number,
  bookStatus: {
    type: String, enum: ['Booked', 'Riding', 'Waiting', 'Reached',
      'Cancelled', ' booked', 'riding', 'waiting', 'reached', 'cancelled']
  },
  checkIncabdrvID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  checkInMeter: Number,
  checkOutMeter: Number,
  checkInDateTime: Date,
  checkOutDateTime: Date,
  billTariff: Number,
  billTotal: Number
});

module.exports = mongoose.model('Bookings', bookSchema, 'Bookings');
