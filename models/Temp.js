const mongoose = require('mongoose');

const TempSchema = new mongoose.Schema({});
const Temp = mongoose.model('Temp', TempSchema);

module.exports = Temp;