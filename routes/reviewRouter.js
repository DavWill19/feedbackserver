const express = require('express');
const reviewRouter = express.Router();
const cors = require('./cors');
const Review = require('../models/review');
const authenticate = require('../authenticate');



reviewRouter.route('/crew/:store')
  .get((req, res, next) => {
    Review.find({ store: req.params.store, type: 'crew' })
      .then((reviews) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(reviews);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.cors, (req, res, next) => {
    Review.create(req.body)
      .then((form) => {
        console.log('Form entry created ', form);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(form);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    Review.findByIdAndUpdate(req.body._id, {
      $set: {
        type: req.body.type,
        store: req.body.store,
        questions: req.body.questions,
      }
    })
      .then((review) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          review
        })
      })
      .catch((err) => next(err));
  })
  .delete((req, res) => {
    res.statusCode = 403;
    res.end('Delete operation not supported on /feedbacks');
  });

  reviewRouter.route('/manager/:store')
  .get((req, res, next) => {
    Review.find({ store: req.params.store, type: 'manager' })
      .then((reviews) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(reviews);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.cors, (req, res, next) => {
    Review.create(req.body)
      .then((form) => {
        console.log('Form entry created ', form);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(form);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    Review.findByIdAndUpdate(req.body._id, {
      $set: {
        type: req.body.type,
        store: req.body.store,
        questions: req.body.questions,
      }
    })
      .then((review) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          review
        })
      })
      .catch((err) => next(err));
  })
  .delete((req, res) => {
    res.statusCode = 403;
    res.end('Delete operation not supported on /feedbacks');
  });

//


module.exports = reviewRouter;