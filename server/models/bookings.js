var mongoose = require('mongoose');
var bookSchema = mongoose.Schema({
  bookDateTime: { type: Date, default: Date() },
  bookCustID: ObjectId,
  bookSource: String,
  bookDestination: String,
  bookTravelDateTime: Number,
  bookStatus: {
    type: String, enum: ['Booked', 'Riding', 'Waiting', 'Reached',
      'Cancelled', ' booked', 'riding', 'waiting', 'reached', 'cancelled']
  },
  checkIncabdrvID: ObjectId,
  checkInMeter: Number,
  checkOutMeter: Number,
  checkInDateTime: Date,
  checkOutDateTime: Date,
  billTariff: Number,
  billTotal: Number
});

module.exports = mongoose.model('Bookings', bookSchema, 'Bookings');
