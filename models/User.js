const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  religion: {
    type: String,
    required: true
  },
  caste: {
    type: String,
    required: true
  },
  subcaste: {
    type: String,
    required: true
  },
  file:{
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  mothertongue: {
    type: String,
    required: true
  },
  marital: {
    type: String,
    required: true
  },
  gender:{
    type:String,
    required:true
  },
  height: {
    type: String,
    required: true
  },
  financial: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  values: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  employed: {
    type: String,
    required: true
  },
  occupation:{
    type:String,
    required:true
  },
  salary:{
    type:String,
    required:true
  },
  about: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  photo1: {
    type: Buffer,

  },
  photo2: {
    type: Buffer,

  },
  photo3: {
    type: Buffer,

  },
  photo4: {
    type: Buffer,
  },
  horo1:{
    type: Buffer,
  },
  horo2:{
    type: Buffer,
  },
  horo3:{
    type: Buffer,
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
