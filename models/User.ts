import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HydratedDocument, Model, Schema, model } from "mongoose";
import config from "../config";
import { IUser } from "../types";
const SALT_WORK_FACTOR = 10;

interface IUserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (
        this: HydratedDocument<IUser>,
        username: string
      ): Promise<boolean> {
        if (!this.isModified("username")) return true;

        const user: HydratedDocument<IUser> | null = await User.findOne({
          username,
        });
        return !Boolean(user);
      },
      message: "This user is already registered",
    },
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
  next();
});

UserSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  const secret: string = config.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  this.token = jwt.sign({ id: this._id }, secret, { expiresIn: "30d" });
};

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
