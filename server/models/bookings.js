var mongoose = require('mongoose');
var bookSchema = mongoose.Schema({
  bookDate: { type: Date, default: Date() },
  bookCustID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  bookSource: String,
  bookDestination: String,
  bookTravelDate: Date,
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
  billTotal: Number
}
  ,
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Bookings', bookSchema, 'Bookings');
