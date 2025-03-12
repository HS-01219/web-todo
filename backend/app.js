const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
app.listen(process.env.PORT);


const createError = require('http-errors');
const cookieParser = require('cookie-parser');

// var express = require('express');
// var path = require('path');
// var logger = require('morgan');

// const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const worksRouter = require('./routes/works');
const teamsRouter = require('./routes/teams');
const membersRouter = require('./routes/members');

// var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/works', worksRouter);
app.use('/teams', teamsRouter);
app.use('/members', membersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
