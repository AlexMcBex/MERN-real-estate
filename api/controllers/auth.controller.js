import User from "../models/user.model.js";
import { errorHandler } from '../utils/error.js'
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  // hash password 10 times to make it encrypted
  const hashedPassword = await bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (err) {
    // use middleware from index.js to handle error
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body
  try {
    // check if email exists or not hten same for the password
    const validUser = await User.findOne({ email })
    if (!validUser) return next(errorHandler(404, 'User not found!'))
    // bcrypt method to compare hashed password
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'))
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
    // to not show the hashed password in the signin token we destructure the validUser._doc info in password and ...rest, ...rest is the other informations
    const { password: pass, ...rest } = validUser._doc
    // cookie, httpOnly makes it unusuable bhy 3rd party apps
    res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
      .status(200)
      // here we display in json rest instead of validUser, in this way the password is not shown
      .json(rest)
  } catch (error) {
    next(error)
  }
}

// Google OAuth
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      const { password: pass, ...rest } = user._doc
      res
        .cookie('access_token', token, { httpOnly: true }) //set cookie
        .status(200)
        .json(rest) //send user data
    } else {
      // else create the user
      // since a password for the user is required we generate one with google Oauth
      // to get a username we get the google user's name, we remove spaces with split(" ")+join("") we make it lowercase and we add 4 digits in the end
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
      const newUser = new User({
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo
      })
      await newUser.save()
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
      const { password: pass, ...rest } = newUser._doc
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest)
    }
  } catch (err) {
    next(err)
  }
}

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token')
    res.status(200).json('User has been logged out')
  } catch (err) {
    next(err)
  }
}