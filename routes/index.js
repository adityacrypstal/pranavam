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
  query.getUsers((err, users)=>{
    if(req.user.email == 'adityavadityav@gmail.com'){
      res.render('admin', {
        user: req.user,
        users:users,
      })
    }else{
      res.render('profile', {
        user: req.user
      })
    }
  });
  
}
);
router.get('/profile',(req, res)=>{
  console.log(req.user);
  res.render('profile', {
    user: req.user,
  })
})
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
