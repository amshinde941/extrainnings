const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Modules = require("../models/Module");
const Courses = require("../models/Course");
import { userAuth, adminAuth } from "../middleware/index";
const moduleRouter = express.Router();

moduleRouter.use(bodyParser.json());

moduleRouter
  .route("/:courseId/modules")
  .get(userAuth, (req, res, next) => {
    Courses.findById(req.params.courseId)
      .populate("modules")
      .then(
        (course) => {
          if (course != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(course.modules);
          } else {
            err = new Error("Course " + req.params.courseId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(adminAuth, (req, res, next) => {
    Courses.findById(req.params.courseId)
      .then(
        (course) => {
          if (course != null) {
            Modules.create(req.body).then(
              (module) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(module);
                course.modules.push(module._id);
                course.save();
              },
              (err) => next(err)
            );
          } else {
            err = new Error("course " + req.params.courseId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

moduleRouter
  .route("/:courseId/modules/:moduleId")
  .get(userAuth, (req, res, next) => {
    Modules.findById(req.params.moduleId)
      .then(
        (module) => {
          if (module != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(module);
          } else {
            err = new Error("module " + req.params.moduleId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(adminAuth, (req, res, next) => {
    Courses.findOne(req.params.courseId)
      .then((course) => {
        if (course.author == req.user._id) {
          Modules.findByIdAndUpdate(
            req.params.moduleId,
            {
              $set: req.body,
            },
            { new: true }
          ).then(
            (module) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(module);
            },
            (err) => next(err)
          );
        }
      })
      .catch((err) => next(err));
  })

  .delete(adminAuth, (req, res, next) => {
    Courses.findOne(req.params.courseId)
      .then((course) => {
        if (course.author == req.user._id) {
          Modules.findByIdAndRemove(req.params.moduleId).then(
            (resp) => {
              Courses.findById(req.params.courseId)
                .then(
                  (course) => {
                    course.modules = course.modules.filter(
                      (module) => module != req.params.moduleId
                    );
                    return course;
                  },
                  (err) => res.status(400).json({ message: err.message })
                )
                .then(
                  (course) => {
                    Courses.findByIdAndUpdate(
                      course._id,
                      { $set: course },
                      { new: true, upsert: true }
                    ).then(
                      (course) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(course);
                      },
                      (err) => next(err)
                    );
                  },
                  (err) => next(err)
                );
            },
            (err) => next(err)
          );
        }
      })
      .catch((err) => next(err));
  });

module.exports = moduleRouter;
