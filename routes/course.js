const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Courses = require('../models/Course');

const courseRouter = express.Router();

courseRouter.use(bodyParser.json());

courseRouter.route('/')
    //.options(cors.corsWithOptions , (req, res )=> { res.sendStatus(200); })

    .get((req, res, next) => {
        Courses.skills.find(req.query.skill)
            .then((courses) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(courses);
            }, (err) => next(err))
            .catch((err) => next(err));

    })

    .post((req, res, next) => {
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

    .get( (req, res, next) => {
        Courses.findById(req.params.courseId)
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put( (req, res, next) => {
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
        Course.findByIdAndRemove(req.params.courseId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));

    });


module.exports = courseRouter;
