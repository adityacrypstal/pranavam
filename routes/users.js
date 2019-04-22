const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var msg91 = require('msg91-sms');
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
var moment = require('moment');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API);
const authkey = process.env.msg91;
const senderid = 'PNVMAT';
const route = '4';
const dialcode = '91';

// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }

    cb(undefined, true)
  }
});
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('form'));

// Register
var cpUpload = upload.fields([{ name: 'photo1', maxCount: 1 }, { name: 'photo2', maxCount: 1 }, { name: 'photo3', maxCount: 1 }, { name: 'photo4', maxCount: 1 }, { name: 'doc1', maxCount: 3 }])
router.post('/register', cpUpload, async (req, res) => {
  var photo1 = await sharp(req.files['photo1'][0].buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  var photo2 = await sharp(req.files['photo2'][0].buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  var photo3 = await sharp(req.files['photo3'][0].buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  var photo4 = await sharp(req.files['photo4'][0].buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  var horo1 = req.files['doc1'][0].buffer;
  const { fname, lname, phone, email, dob, religion, caste, subcaste, password1, password2, mothertongue, marital, height, financial, type, values, education, employed, about } = req.body;
  let errors = [];

  if (!fname || !email || !password1 || !password2 || !phone || !religion || !caste || !subcaste || !mothertongue || !marital || !financial || !type || !values || !education || !employed || !about) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password1 != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password1.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('form', {
      errors, fname, lname, phone, email, dob, religion, caste, subcaste, password1, password2, mothertongue, marital, height, financial, type, values, education, employed, about
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('form', {
          errors, fname, lname, phone, email, dob, religion, caste, subcaste, password1, password2, mothertongue, marital, height, financial, type, values, education, employed, about
        });
      } else {
        var password = password1;
        const newUser = new User({
          fname, lname, phone, email, dob, religion, caste, subcaste, password, mothertongue, marital, height, financial, horo1, type, values, education, employed, about, photo1, photo2, photo3, photo4
        });
        if (req.files['doc1'][1].buffer) {
          newUser.horo2 = req.files['doc1'][1].buffer;
        }
        if (req.files['doc1'][2].buffer) {
          newUser.horo3 = req.files['doc1'][2].buffer;
        }

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                const msg = {
                  to: user.email,
                  from: 'adityavadityav@gmail.com',
                  subject: 'Registration completed',
                  html: `<p>Thank you <b>${user.fname}. ${user.lname}</b>.Your registration has been completed.You can now login to edit you details.We will contact you soon <br><br><br>
                  Thank you,<br>
                  <b>Pranavam Matrimony</b></p>`,
                }
                var message = `Thank you ${user.fname}.${user.lname}. Your registeration is completed. We will contact you soon.`;
                // msg91.sendOne(authkey, user.phone, message, senderid, route, dialcode, function (response) {
                  sgMail.send(msg).then(resp => console.log(resp)).catch(err => console.log(err));
                  //Returns Message ID, If Sent Successfully or the appropriate Error Message
                  // console.log(response);
                // });
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.render('thank');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
router.get('/getInfo/:id', (req, res) => {
  User.findOne({ "_id": req.params.id }).then((result) => {
    res.render('info', {
      user: result,
      moment: moment
    });
  })
})
router.post('/instantQuery', (req, res) => {
  console.log(req.body);
  var number = '9567682232';
  var message = `${req.body.name} from ${req.body.state} is asking help.Please contact him through ${req.body.phone} or ${req.body.email}`;
  msg91.sendOne(authkey, number, message, senderid, route, dialcode, function (response) {

    //Returns Message ID, If Sent Successfully or the appropriate Error Message
    console.log(response);
  });
  res.redirect('../');
})

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);

});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
