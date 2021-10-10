const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
import { userAuth, adminAuth } from "../middleware/index";
const Courses = require("../models/Course");

const courseRouter = express.Router();

courseRouter.use(bodyParser.json());

courseRouter
  .route("/")

  .get(userAuth, (req, res, next) => {
    Courses.find(req.body)
      .then(
        (courses) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(courses);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(adminAuth, (req, res, next) => {
    req.body.author = req.user._id;
    Courses.create(req.body)
      .then(
        (course) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(course);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

courseRouter
  .route("/:courseId")

  .get((req, res, next) => {
    Courses.findById(req.params.courseId)
      .populate("modules")
      .then(
        (course) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(course);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(adminAuth, (req, res, next) => {
    Courses.findOne(req.params.courseId)
      .then((course) => {
        if (course.author == req.user._id) {
          Courses.findByIdAndUpdate(
            req.params.courseId,
            {
              $set: req.body,
            },
            { new: true }
          ).then(
            (course) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(course);
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
          Courses.findByIdAndRemove(req.params.courseId).then(
            (resp) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(resp.title + " course deleted successfully");
            },
            (err) => next(err)
          );
        }
      })
      .catch((err) => next(err));

  });

module.export = courseRouter;
