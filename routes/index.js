const express = require('express');

var msg91=require('msg91-sms');
const query = require('../controllers/query');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');



// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
//   var authkey='273052AnxgNNYj5cb8b8ae';
//   var number='9567682232';
//   var message='Testing';
//   var senderid='TESTIN';
//   var route='4';
//   var dialcode='91';
// msg91.sendOne(authkey,number,message,senderid,route,dialcode,function(response){
 
//   //Returns Message ID, If Sent Successfully or the appropriate Error Message
//   console.log(response);
//   });
console.log(process.env.MONGO);
  query.getUsers((err, users)=>{
    res.render('admin', {
      user: req.user,
      users:users,
    })
  });
  
}
);
router.post('/filter', (req, res)=>{
  var query = {};
  if(req.body.caste != 'null'){
    query.caste = req.body.caste;
  }
  if(req.body.religion != 'null'){
    query.religion = req.body.religion;
  }
  if(req.body.marital != 'null'){
    query.marital = req.body.marital;
  }
  if(req.body.mothertongue != 'null'){
    query.mothertongue = req.body.mothertongue;
  }
  User.find(query).then((result)=>{
    res.render('admin', {
      user: req.user,
      users:result,
    })
  });
})

module.exports = router;
