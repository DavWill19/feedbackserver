const express = require('express');
const feedbackRouter = express.Router();
const cors = require('./cors');
const Form = require('../models/form');
const authenticate = require('../authenticate');



feedbackRouter.route('/')
.options( (req, res) => { res.sendStatus(200); })
.get( authenticate.verifyUser, (req, res, next) => {
    Form.find()
      .then((form) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(
          success = true,
          form
          );
      })
      .catch((err) => next(err));
  })
  .post(cors.cors, (req, res, next) => {
    Form.create(req.body)
      .then((form) => {
        console.log('Form entry created ', form);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(form);
      })
      .catch((err) => next(err));
  })
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /feedbacks');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('Delete operation not supported on /feedbacks');
});

//


module.exports = feedbackRouter;