import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/UserModel.js";

import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
} from "../config/_env.js";

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

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, permLevel: user.permLevel },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES }
  );
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

    // DO LOGIC FOR USER CREATION !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // const accessToken = generateAccessToken(user);

    // return res.json({
    //   accessToken,
    //   user: { username: user.username, permLevel: user.permLevel },
    // });

    return res.sendStatus(200);

  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({ error: e.message });
  }
}

export async function userSignIn(req, res) {
  try {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    accessToken,
    user: { username: user.username, permLevel: user.permLevel },
  });

  } catch (e) {
    console.error("Signin error:", e);
    res.status(500).json({ error: e.message });
  }
}

export async function userRefreshToken(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "Missing refresh token" });

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ error: "User not found" });

    const newAccessToken = generateAccessToken(user);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
}

export async function userSignOut(req, res) {
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
}