const User = require('../models/User');

const mongoose = require('mongoose');

const getUsers = (callback)=>{
    User.find()
    .then((users)=>callback(null, users))
    .catch((err)=>callback(err, null));
}
module.exports = {getUsers}