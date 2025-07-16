import express from "express";
import { Error } from "mongoose";
import auth, { RequestWithUser } from "../middleware/auth";
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();
    await user.save();
    return res.send({ message: "Register successfully!", user });
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    };
  }
});

usersRouter.post("/sessions", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).send({ error: "Username not found" });
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({ error: "Password is wrong" });
  }

  user.generateToken();
  await user.save();

  return res.send({ message: "Username and password correct!", user });
});

usersRouter.post("/secret", auth, async (req, res) => {
  const user = (req as RequestWithUser).user;

  return res.send({
    message: "Secret message",
    username: user.username,
  });
});

export default usersRouter;
