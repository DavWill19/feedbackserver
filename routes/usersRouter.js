const express = require('express');
const User = require('../models/users');
const passport = require('passport');
const usersRouter = express.Router();
const authenticate = require('../authenticate');
// const cors = require('./cors');
const { route } = require('.');


/* GET users listing. */

usersRouter.route('/')
.options( (req, res) => { res.sendStatus(200); })
.get(  authenticate.verifyUser, function (req, res, next) {
  User.find()
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.json(users);
    })
    .catch(err => next(err));
});

usersRouter.route('/signup')
.options( (req, res) => { res.sendStatus(200); })
.post(  (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save(err => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    }
  );
});
usersRouter.route('/login')
.options( (req, res) => { res.sendStatus(200); })
.post(passport.authenticate('local'), (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.json({ user, success: true, token: token, status: 'You are successfully logged in!' });
    })
});

usersRouter.route('/logout')
.options( (req, res) => { res.sendStatus(200); })
.get( (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
});

module.exports = usersRouter;