import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

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

export const signin = async(req, res, next)=>{
  const {email, password}= req.body
  try{
    // check if email exists or not hten same for the password
    const validUser = await User.findOne({email})
    if (!validUser) return next(errorHandler(404, 'User not found!'))
    // bcrypt method to compare hashed password
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'))
  }catch(error){
    next(error)
  }
}
