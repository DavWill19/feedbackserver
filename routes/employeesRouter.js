const express = require('express');
const employeesRouter = express.Router();
const cors = require('./cors');
const Employee = require('../models/employees');
const authenticate = require('../authenticate');
const moment = require('moment');
const nodemailer = require('nodemailer');
const email = require('../email');
const config = require('../config');
var fs = require('fs');
var pdf = require('html-pdf');
var cron = require('node-cron');

// send email it is 2:30pm


var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: config.auth.user,
        pass: config.auth.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

employeesRouter.route('/cronjob/:cronjob')
    .get(cors.cors, (req, res, next) => {
        const mailDataPassChange = {
            from: 'Wenventure Inc <devwill2484@outlook.com>',  // sender address
            name: 'Wenventure Inc',
            to: "davwill@live.com",
            // list of receivers
            subject: `Test server`, // Subject line
            text: `Test Server`, // plain text body
            html: "<h2> Test <h2>" // html body
        };
        transporter.sendMail(mailDataPassChange, function (err, info) {
            if (err)
                res.json({ status: "Fail!" });
            else
            res.json({status: "Success!"});
        });
    });





function getEmail(store) {
    switch (store) {
        case 'Altoona23':
            return "altoona23@wenventure-pa.com";
        case 'Cricketfield40':
            return "cricketfield40@wenventure-pa.com";
        case 'Hollidaysburg34':
            return "hollidaysburg34@wenventure-pa.com";
        case 'Bedford36':
            return "bedford36@wenventure-pa.com";
        case 'Somerset20':
            return "somerset20@wenventure-pa.com";
        case 'Johnstown25':
            return "johnstown25@wenventure-pa.com";
        case 'Ebensburg30':
            return "ebensburg30@wenventure-pa.com";
        case 'Clarion37':
            return "clarion37@wenventure-pa.com";
        case 'StMarys32':
            return "stmarys32@wenventure-pa.com";
        case 'Indiana22':
            return "indiana22@wenventure-pa.com";
        case 'Punxy31':
            return "punxy31@wenventure-pa.com";
        case 'Dubois21':
            return "dubois21@wenventure-pa.com";
        default:
            return null
    }
}




employeesRouter.route('/:username')
    .options((req, res) => { res.sendStatus(200); })
    .get((req, res, next) => {
        Employee.find({ site: req.params.username })
            .then(employee => {
                if (employee) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(employee);
                } else {
                    err = new Error('Employee ' + req.params.username + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch(err => next(err))
    })

    .post(cors.cors, (req, res, next) => {
        Employee.create(req.body)
            .then((employees) => {
                console.log('Form entry created ', employees);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(employees);
            })
            .catch((err) => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /employees');
    })
    .delete((req, res) => {
        res.statusCode = 403;
        res.end('Delete operation not supported on /employees');
    });

employeesRouter.route('/message/:username')
    .get((req, res, next) => {
        const title1 = 'Review Scheduler';
        const message1 = 'The sole purpose of this program is to put a process in place that will enable our employees to maximize their potential.';
        const title2 = 'Did you know?';
        const message2 = 'The easiest way to stop your employees from leaving is to develop a plan to make them stay.';
        const title3 = 'Did you know?';
        const message3 = `Turnover is expensive, not only for the cost of training replacements but for the hidden costs of having employees who really don't want to be there in the first place`;
        // const title3 = 'Did you know?';
        // const message3 = 'The culture of your restaurant is dictated by you! Be a positive role model!';
        const success = true;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            success
        }));

    }
        , (err) => next(err));





employeesRouter.route('/deactivate/:employeesId')
    .put(cors.cors, (req, res, next) => {
        Employee.findByIdAndUpdate(req.params.employeesId, {
            $set: {
                active: req.body.active
            }
        })
            .then((employees) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(employees);
            })
            .catch((err) => next(err));
    })

employeesRouter.route('/editemployee/:employeesId')
    .put(cors.cors, (req, res, next) => {
        Employee.findByIdAndUpdate(req.params.employeesId, {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
            }
        })
            .then((employees) => {
                res.statusCode = 200;
                res.success = true;
                res.setHeader('Content-Type', 'application/json');
                res.json(employees);
            })
            .catch((err) => next(err));
    })

employeesRouter.route('/nextreview/:employeesId')
    .put(cors.cors, (req, res, next) => {
        Employee.findByIdAndUpdate(req.params.employeesId, {
            $set: {
                nextReview: req.body.nextreview
            }
        })
            .then((employees) => {
                res.statusCode = 200;
                res.success = true;
                res.setHeader('Content-Type', 'application/json');
                res.json(employees);
            })
            .catch((err) => next(err));
    })

employeesRouter.route('/newreview/:employeesId')
    .put(cors.cors, (req, res, next) => {
        var options = { format: 'Letter' };
        var html = email.reviewStatus(
            req.body.name,
            req.body.review.date,
            req.body.review.store,
            req.body.review.effectiveDate,
            req.body.review.currentRate,
            req.body.review.newPayrate);

        pdf.create(html, options).toFile(`./${req.body.review.store}status.pdf`, function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/status.pdf' }
        });
        console.log(req.body.review);
        //add rating
        setTimeout(function () {
            const storeEmail = getEmail(req.body.review.store);
            const score = req.body.review.score;
            const mailDataPassChange = {
                from: 'Wenventure Inc <devwill2484@outlook.com>',  // sender address
                name: 'Wenventure Inc',
                to: req.body.email,
                attachments: [
                    {
                        filename: `${req.body.review.store}status.pdf`,
                        path: `./${req.body.review.store}status.pdf`,
                    }
                ],
                cc: storeEmail,   // list of receivers
                subject: `Your Performance Review -${req.body.review.date}`, // Subject line
                text: `New Review!`, // plain text body
                html: email.reviewMessage(`New Performance Review!`, req.body.name, req.body.review, score) // html body
            };
            transporter.sendMail(mailDataPassChange, function (err, info) {
                if (err)
                    console.log(err)
                else
                    console.log(info);
            });
        }, 5000);
        Employee.findByIdAndUpdate(req.params.employeesId, {
            $set: {
                nextReview: req.body.nextReview,
                lastReview: new Date(),
            },
            $push: { history: req.body.review }

        })
            .then((employees) => {
                res.statusCode = 200;
                res.success = true;
                res.setHeader('Content-Type', 'application/json');
                res.json(employees);
            })
            .catch((err) => next(err));
    })


module.exports = employeesRouter;