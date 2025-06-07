import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";
import user from "../models/user.js";

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

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    return res.json({ user, jwtToken });
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
    if (!isMatch) {
      return res.json({ message: "Invalid  " });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({ user, jwtToken });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = (req.headers.authorization.split(" ")[1] = "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      return res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
    const {skills = [], role, email} = req.body;
    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Only admins can update user roles" });
    }
    const currentUser = await User.findOne({email});
    if(!currentUser) {
        return res.status(404).json({ message: "User not found" });
    }
    await User.updateOne(
        { email },
        {skills : skills.length ? skills : user.skills, role: role || user.role}
    
    );
    return res.json({ message: "User updated successfully", user: currentUser._id });
}


export const getUser = async (req, res) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Only admins can update user roles" });
    }
    const users = await User.find().select("-password");
    return res.json({ users });
}


