import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/UserModel.js"; 
import { JWT_SECRET } from "../config/_env.js";

import { getTimestamp } from "../utils/timestamp.js";

const saltRounds = 12;


export async function createInitialAdmin() {
  const count = await User.countDocuments();
  if (count === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await User.create({
      username: "admin",
      password: hashedPassword,
      permLevel: 1,
    });
    console.log(`[${getTimestamp()}] Default admin created: username=admin, password=admin123`);
  }
}

export async function userSignUp(req, res) {
  try {
    const { username, password, permLevel = 2 } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required." });
    }
    
    if (![1, 2].includes(permLevel)) {
      return res.status(400).json({ error: "Invalid permission level." });
    }

    const userInDatabase = await User.findOne({ username });
    
    if (userInDatabase) {
      return res.status(409).json({error: 'Username already taken.'});
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username,
      password: hashedPassword,
      permLevel,
    });

    const payload = { username: user.username, _id: user._id, permLevel: user.permLevel };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({ token, user: { username: user.username, permLevel: user.permLevel } });

  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({ error: e.message });
  }
}

export async function userSignIn(req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password, user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const payload = { username: user.username, _id: user._id, permLevel: user.permLevel };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token, user: { username: user.username, permLevel: user.permLevel } });

  } catch (e) {
    console.error("Signin error:", e);
    res.status(500).json({ error: e.message });
  }
}