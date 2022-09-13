var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const config = require('./config');
const cors = require('cors');
const mongoose = require('mongoose');
const url = config.mongoUrl;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRouter');
var feedbackRouter = require('./routes/feedbackRouter');
var borrowRouter = require('./routes/borrowRouter');
var crewUserRouter = require('./routes/crewUserRouter');
var employeesRouter = require('./routes/employeesRouter');
var reviewRouter = require('./routes/reviewRouter');
var cron = require('node-cron');
const nodemailer = require('nodemailer');
const employee = require('./models/employees');
const email = require('./email');
const passport = require('passport');
const authenticate = require('./authenticate');
const moment = require('moment');


function getSurveyUser(username) {
  let retVal = "";
  switch (username) {
    case 'Altoona23':
      retVal = 'Altoona-PlankRd';
      break;
    case 'Cricketfield40':
      retVal = 'Altoona-Cricketfield';
      break;
    case 'Hollidaysburg34':
      retVal = 'Hollidaysburg';
      break;
    case 'Bedford36':
      retVal = 'Bedford';
      break;
    case 'Somerset20':
      retVal = 'Somerset';
      break;
    case 'Johnstown25':
      retVal = 'Johnstown';
      break;
    case 'Ebensburg30':
      retVal = 'Ebensburg';
      break;
    case 'Clarion37':
      retVal = 'Clarion';
      break;
    case 'StMarys32':
      retVal = 'St-Marys';
      break;
    case 'Indiana22':
      retVal = 'Indiana';
      break;
    case 'Punxy31':
      retVal = 'Punxsutawney';
      break;
    case 'Dubois21':
      retVal = 'Dubois';
      break;
    default:
      return null
  }
  return retVal;


}

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

///set this to send training survey after 30 days
cron.schedule('00 00 10 * * *', () => {
  var time30 = moment().subtract(30, 'days').format('YYYY-MM-DD');


  employee.find({})
    .then(employees => {
      employees.forEach(employee => {
        if (employee.active && moment(employee.startDate).format('YYYY-MM-DD') === time30) {
          console.log(employee.firstname + " " + employee.lastname + " " + employee.email);
          const mailDataPassChange = {
            from: 'Wenventure Inc <devwill2484@outlook.com>',  // sender address
            name: 'Wenventure Inc',
            to: employee.email,   // list of receivers
            subject: 'Wenventure survey!', // Subject line
            text: `New Survey!`, // plain text body
            html: email.survey(`${employee.firstname}, We want your feedback!`, 'Tell us about your training!', `https://wenvensurvey.netlify.app/?store=${getSurveyUser(employee.site)}&firstname=${employee.firstname}&lastname=${employee.lastname}&type=training`) // html body
          };
          transporter.sendMail(mailDataPassChange, function (err, info) {
            if (err)
              console.log(err)
            else
              console.log(info);
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
    }
    );
}
);

///set this to send survey after first 90 days
cron.schedule('00 00 10 * * *', () => {
  var time90 = moment().subtract(30, 'days').format('YYYY-MM-DD');


  employee.find({})
    .then(employees => {
      employees.forEach(employee => {
        if (employee.active && moment(employee.startDate).format('YYYY-MM-DD') === time90) {
          console.log(employee.firstname + " " + employee.lastname + " " + employee.email);
          const mailDataPassChange = {
            from: 'Wenventure Inc <devwill2484@outlook.com>',  // sender address
            name: 'Wenventure Inc',
            to: employee.email,   // list of receivers
            subject: 'Wenventure Survey!', // Subject line
            text: `New Survey!`, // plain text body
            html: email.survey(`${employee.firstname}, Just checking in...`, 'How are things going?', `https://wenvensurvey.netlify.app/?store=${getSurveyUser(employee.site)}&firstname=${employee.firstname}&lastname=${employee.lastname}&type=morale`) // html body
          };
          transporter.sendMail(mailDataPassChange, function (err, info) {
            if (err)
              console.log(err)
            else
              console.log(info);
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
    }
    );
}
);

//send survey every 6 months for morale
cron.schedule('00 00 6 * * *', () => {
 
  employee.find({})
    .then(employees => {
      employees.forEach(employee => {
          if (employee.active && moment().day() === moment(employee.startDate).day() && ((moment(employee.startDate).month() + 6) === moment().month() || moment(employee.startDate).month()) === moment().month()) {
          console.log(employee.firstname + " " + employee.lastname + " " + employee.email);
          const mailDataPassChange = {
            from: 'Wenventure Inc <devwill2484@outlook.com>',  // sender address
            name: 'Wenventure Inc',
            to: employee.email,   // list of receivers
            subject: 'Wenventure survey!', // Subject line
            text: `New Survey!`, // plain text body
            html: email.survey(`${employee.firstname}, Give us your feedback!`, 'How are things going?', `https://wenvensurvey.netlify.app/?store=${getSurveyUser(employee.site)}&firstname=${employee.firstname}&lastname=${employee.lastname}&type=morale`) // html body
          };
          transporter.sendMail(mailDataPassChange, function (err, info) {
            if (err)
              console.log(err)
            else
              console.log(info);
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
    }
    );
}
);


const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var app = express();

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    //may need to delete the line below
    allowedHeaders: ['*'],
  })
);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/feedback', feedbackRouter);
app.use('/borrow', borrowRouter);
app.use('/crewuser', crewUserRouter);
app.use('/employees', employeesRouter);
app.use('/review', reviewRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
