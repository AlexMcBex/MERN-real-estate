import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
    // hash password 10 times to make it encrypted
    const hashedPassword = await bcryptjs.hashSync(password, 10)
  const newUser = new User({ username, email, password: hashedPassword });

  await newUser.save();
  res.status(201).json('User Created successfully')


};
