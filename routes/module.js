const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Modules = require('../models/Module');
const Courses = require('../models/Course');
const moduleRouter = express.Router();

moduleRouter.use(bodyParser.json());

moduleRouter.route('/:courseId/modules')
.get((req,res,next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course.modules);
        }
        else {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null) {
            course.modules.push(req.body);
            course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else {
            err = new Error('course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /courses/'
        + req.params.courseId + '/modules');
})
.delete((req, res, next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null) {
            for (var i = (course.modules.length -1); i >= 0; i--) {
                course.modules.id(course.modules[i]._id).remove();
            }
            course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else {
            err = new Error('course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

courseRouter.route('/:courseId/modules/:moduleId')
.get((req,res,next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null && course.modules.id(req.params.moduleId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course.modules.id(req.params.moduleId));
        }
        else if (course == null) {
            err = new Error('course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('module ' + req.params.moduleId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /courses/'+ req.params.courseId
        + '/modules/' + req.params.moduleId);
})
.put((req, res, next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null && course.modules.id(req.params.moduleId) != null) {
            course.modules.id(req.params.moduleId) = req.body;
            course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else if (course == null) {
            err = new Error('course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('module ' + req.params.moduleId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Course.findById(req.params.courseId)
    .then((course) => {
        if (course != null && course.modules.id(req.params.moduleId) != null) {
            course.modules.id(req.params.moduleId).remove();
            course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else if (course == null) {
            err = new Error('course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('module ' + req.params.moduleId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = moduleRouter;