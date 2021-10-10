import express from "express";
import { User } from "../models/index";
import userAuth from "../middleware/userAuth";
const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(404).send({ e });
  }
});

UserRouter.post("/user/login", async (req, res) => {
  try {
    const user = await User.findUsingCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(404).send(e);
  }
});

UserRouter.post("/user/logout", userAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send("user logged out " + req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

UserRouter.post("/user/logoutall", userAuth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("User logged out of all sesssions" + req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

UserRouter.get("/user/me", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

UserRouter.delete("/user/me", userAuth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send("User " + req.user.email + " is deleted");
  } catch (e) {
    res.send(e);
  }
});

UserRouter.patch("/user/me", async (req, res) => {
  const tobeUpdated = [
    "name",
    "email",
    "password",
    "isInstitute",
    "instituteName",
    "completedCourses",
  ];
  const updates = Object.keys(req.body);
  const validateUpdate = updates.every((update) => 
      tobeUpdated.includes(update)
  );

  if(!validateUpdate){
      return res.status(400).send({error:"Invalid update request"});
  }

  try{
      updates.forEach(update => {
          req.user[update] = req.body[update];
      });

      await req.user.save();
      res.status(200).send(req.user);
  }catch(e){
      res.status(400).send(e);
  }

});

export { UserRouter };
