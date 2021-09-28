const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const verifyUser = require('./verifyUser');
const verifyAdmin = require('./verifyAdmin');
const Courses = require('../models/Course');

const courseRouter = express.Router();

courseRouter.use(bodyParser.json());  
    
courseRouter.route('/')
    //.options(cors.corsWithOptions , (req, res )=> { res.sendStatus(200); })

    .get( (req, res, next) => {
        Courses.find(req.body)
            .then((courses) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(courses);
            }, (err) => next(err))
            .catch((err) => next(err));

    })

    .post((req, res, next) => {
        // req.body.author = req.admin._id;
        Courses.create(req.body)
            .then((course) => {
                console.log('Course created : ', course);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

courseRouter.route('/:courseId')
    //.options(cors.corsWithOptions , (req, res )=> { res.sendStatus(200); })

    .get((req, res, next) => {
        Courses.findById(req.params.courseId)
        .populate('modules')
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put((req, res, next) => {
        Courses.findByIdAndUpdate(req.params.courseId, {
            $set: req.body
        }, { new: true })
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete((req, res, next) => {
        Courses.findByIdAndRemove(req.params.courseId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp.title + " course deleted successfully");
            }, (err) => next(err))
            .catch((err) => next(err));

    });


module.exports = courseRouter;

