import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";

export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      skills,
    });
    await inngest.send({
      name: "user/signup",
      data: {
        email,
      },
    });

    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
   return res.json({user, jwtToken})
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.find({ email });
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
   const isMatch = await bcrypt.compare(password, user.password);
   if(!isMatch){
    return res.json({ message: "Invalid  " });
   }

    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({user, jwtToken})

  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const logout = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.find({ email });
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
   const isMatch = await bcrypt.compare(password, user.password);
   if(!isMatch){
    return res.json({ message: "Invalid  " });
   }

    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({user, jwtToken})
    
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
