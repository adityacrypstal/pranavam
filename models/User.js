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
    required: false
  },
  subcaste: {
    type: String,
    required: false
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
    required:false
  },
  height: {
    type: String,
    required: false
  },
  financial: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  values: {
    type: String,
    required: false
  },
  education: {
    type: String,
    required: false
  },
  employed: {
    type: String,
    required: false
  },
  occupation:{
    type:String,
    required:false
  },
  salary:{
    type:String,
    required:false
  },
  address:{
    type:String,
    required:true
  },
  about: {
    type: String,
    required: false
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
