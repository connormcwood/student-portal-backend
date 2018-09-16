const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const studentRouters = require('./api/routes/students');
const teacherRouters = require('./api/routes/teachers');
const moduleRouters = require('./api/routes/modules');
const gradeRouters = require('./api/routes/grades');

mongoose.connect('mongodb://172.18.0.2:27017/studentportaldb', {useNewUrlParser: true});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Authorization');
    if(req.method == 'OPTIONS') {
        res.header('Access-Control-Methods', 'PUT, POST, DELETE, PATCH, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/students', studentRouters);
app.use('/teachers', teacherRouters);
app.use('/modules', moduleRouters);
app.use('/grades', gradeRouters);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;