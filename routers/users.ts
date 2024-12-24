import express, { Request } from "express";
import { Error } from "mongoose";
import User from "../models/User";
import auth, { RequestWithUser } from "../middleware/auth";

const usersRouter = express.Router();

usersRouter.post("/", async (req: any, res: any, next: any) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();
    await user.save();
    return res.send(user);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

usersRouter.post("/sessions", async (req: any, res: any) => {
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
