import { User, jwtToken } from "../model/user.js";
import bcryptJS from "bcryptjs";

// @desc    Auth user & get token
//@route    POST /api/users/login
//@access   Public
export const authUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select(
      "-createdAt -updatedAt -__v"
    );
    if (!user)
      return res
        .status(401)
        .json({ message: "email does not exist.", status: "error" });

    const isPassword = await bcryptJS.compare(password, user.password);

    if (!isPassword) {
      return res.status(401).json({ message: "incorrect password entry" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: jwtToken(user),
    });
  } catch (err) {
    next(err);
  }
};

//@desc      Fetch user profile
//@route    GET /api/users/profile
//@access       Private
export const getUserprofile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "invalid user" });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: jwtToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

//@desc      Fetch user profile
//@route    PUT /api/users/profile
//@access       Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "invalid user" });
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password || user.password;
    }
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    next(err);
  }
};

//@desc     register new user
//@route     POST /api/users
//@access    Public
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "user already exist" });

    const newUser = await new User({ email, password, name });

    if (!newUser) return res.status(502).json({ message: "error saving user" });

    await newUser.save();

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    error.statusCode = 404;
    next(error);
  }
};
