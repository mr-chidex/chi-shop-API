import mongoose from "mongoose";
import bcryptJs from "bcryptjs";
import JWT from "jsonwebtoken";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcryptJs.genSalt(12);
    const hashedPassword = await bcryptJs.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(new Error(error));
  }
});

export const jwtToken = (user) => {
  return JWT.sign(
    {
      userId: user._id,
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
};

export const User = mongoose.model("User", userSchema);
