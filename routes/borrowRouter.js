const express = require('express');
const borrowRouter = express.Router();
const cors = require('./cors');
const Borrow = require('../models/borrow');
const authenticate = require('../authenticate');



borrowRouter.route('/')
.options( (req, res) => { res.sendStatus(200); })
.get(  (req, res, next) => {
    Borrow.find()
      .then((borrow) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(borrow);
      })
      .catch((err) => next(err));
  })
  .post(cors.cors, (req, res, next) => {
    Borrow.create(req.body)
      .then((borrow) => {
        console.log('Form entry created ', borrow);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(borrow);
      })
      .catch((err) => next(err));
  })
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /borrow');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('Delete operation not supported on /borrow');
});

//


module.exports = borrowRouter;