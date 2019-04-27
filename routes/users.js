const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var msg91 = require('msg91-sms');
const multer = require('multer')
const path = require('path')
var moment = require('moment');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API);
const authkey = process.env.msg91;
const senderid = 'PNVMAT';
const route = '4';
const dialcode = '91';
var util = require('util')
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');
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
const cpUpload = upload.fields([{ name: 'photo1', maxCount: 1 }, { name: 'photo2', maxCount: 1 }, { name: 'photo3', maxCount: 1 }, { name: 'photo4', maxCount: 1 }, { name: 'doc1', maxCount: 3 }])
router.post('/register', cpUpload, async (req, res) => {
  //Form vaidation starts here
  const { fname, lname, phone, email, dob, religion, caste, subcaste, password1, password2, mothertongue, marital, height, financial, type, values, education, employed, about, occupation, gender, salary } = req.body;
  let errors = [];

  if (!fname || !email || !password1 || !password2 || !phone || !religion || !caste || !subcaste || !mothertongue || !marital || !financial || !type || !values || !education || !employed || !about || !gender || !occupation || !salary) {
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
      errors, fname, lname, phone, email, dob, religion, caste, subcaste, password1, password2, mothertongue, marital, height, financial, type, values, education, employed, occupation, salary, gender, about
    });
    //Form validation ends here

  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('form', {
          errors, fname, lname, phone, email, dob, religion, caste, subcaste, password1, password2, mothertongue, marital, height, financial, type, values, education, employed, occupation, salary, gender, about
        });
      } else {
        var password = password1;
        const newUser = new User({
          fname, lname, phone, email, dob, religion, caste, subcaste, password, mothertongue, marital, height, financial, type, values, education, employed, occupation, salary, gender, about,
        });
        //Images and its function
        console.log(req.files);
        if (req.files['photo1']) {
          newUser.photo1 = req.files['photo1'][0].buffer;
        }
        if (req.files['photo2']) {
          newUser.photo2 = req.files['photo2'][0].buffer;
        }
        if (req.files['photo3']) {
          newUser.photo3 = req.files['photo3'][0].buffer;
        }
        if (req.files['photo4']) {
          newUser.photo4 = req.files['photo4'][0].buffer;
        }
        if (req.files['doc1']) {
          if (req.files['doc1'][0]) {
            newUser.horo1 = req.files['doc1'][0].buffer;
          }
          if (req.files['doc1'][1]) {
            newUser.horo2 = req.files['doc1'][1].buffer;
          }
          if (req.files['doc1'][2]) {
            newUser.horo3 = req.files['doc1'][2].buffer;
          }
        }
        //End image functions

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                const msg2 = {
                  to: 'matrimonypranavam@gmail.com',
                  from: 'matrimonypranavam@gmail.com',
                  subject: 'New User Registered.',
                  html: `<p> <b>${user.fname}. ${user.lname}</b> registered to Pranavam Matrimony.Please find details at admin panel. <br><br><br>
                  Thank you,<br>
                  <b>Pranavam Matrimony</b></p>`,
                }
                const msg = {
                  to: user.email,
                  from: 'matrimonypranavam@gmail.com',
                  subject: 'Registration completed',
                  html: `<p>Thank you <b>${user.fname}. ${user.lname}</b>.Your registration has been completed.You can now login to edit you details.We will contact you soon <br><br><br>
                  Thank you,<br>
                  <b>Pranavam Matrimony</b></p>`,
                }
                var message = `Thank you ${user.fname}.${user.lname}. Your registeration is completed. We will contact you soon.`;
                // msg91.sendOne(authkey, user.phone, message, senderid, route, dialcode, function (response) {
                //   sgMail.send(msg).then(resp => console.log(resp)).catch(err => console.log(err));
                //   sgMail.send(msg2).then(resp => console.log(resp)).catch(err => console.log(err));
                //   //Returns Message ID, If Sent Successfully or the appropriate Error Message
                //   console.log(response);
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
});

router.post('/update/:id', cpUpload, (req, res) => {
  const { fname, lname, phone, email, dob, religion, caste, subcaste, gender, password1, mothertongue, marital, height, financial, type, values, education, employed, occupation, salary, about } = req.body;
  const password = password1;
  var query = { _id: req.params.id };
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      const fields = { fname: fname, lname: lname, phone: phone, email: email, dob: dob, religion: religion, caste: caste, subcaste: subcaste, gender: gender, password: hash, mothertongue: mothertongue, marital: marital, height: height, financial: financial, type: type, values: values, education: education, employed: employed, occupation: occupation, salary: salary, about: about };
      if (req.files['photo1']) {
        fields.photo1 = req.files['photo1'][0].buffer;
      }
      if (req.files['photo2']) {
        fields.photo2 = req.files['photo2'][0].buffer;
      }
      if (req.files['photo3']) {
        fields.photo3 = req.files['photo3'][0].buffer;
      }
      if (req.files['photo4']) {
        fields.photo4 = req.files['photo4'][0].buffer;
      }
      if (req.files['doc1']) {
        if (req.files['doc1'][0]) {
          fields.horo1 = req.files['doc1'][0].buffer;
        }
        if (req.files['doc1'][1]) {
          fields.horo2 = req.files['doc1'][1].buffer;
        }
        if (req.files['doc1'][2]) {
          fields.horo3 = req.files['doc1'][2].buffer;
        }
      }

      User.updateOne(query, fields, (err, response) => {
        if (err) throw err;
        req.flash(
          'success_msg',
          'Your details has been updated'
        );
        res.redirect('/users/login');

      })
    });
  });
});
router.post('/reset', (req, res) => {
  User.findOne({ email: req.body.email }, (err, response) => {
    var human_id = response._id.toString().substr(0,7);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(human_id, salt, (err, hash) => {
        User.updateOne({ _id: response._id }, { password: hash }, (err, ress) => {
          const msg = {
            to: response.email,
            from: 'matrimonypranavam@gmail.com',
            subject: 'Reset Password',
            html: `Hello ${response.fname}. ${response.lname}, This is your one resetted  password ${human_id} . You have to change it as soon as possible through your profile page<br><br><br>
            Thank you,<br>
            <b>Pranavam Matrimony</b></p>`,
          }
          sgMail.send(msg).then((resp) => {
            req.flash(
              'success_msg',
              'Your details has been mailed'
            );
            res.redirect('/users/login');
          }).catch(err => console.log(err));
        })

      });
    });
  })


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
