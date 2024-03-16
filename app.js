const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Database connection import
const db = require("./utils/db/db_connection");
const cors = require("cors");

// DataBase Schema import
const User = require("./modules/users/userSchema");

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "500kb" }));
dotenv.config();
app.use(cors());

// Define the register route
app.post("/register", async (req, res) => {
  try {
    // Extract user details from the request body
    const { username, email, password, userType } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userType,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    // Respond with success message
    res
      .status(201)
      .json({ message: "SignUp Successfully", token, user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define the login route
app.post("/login", async (req, res) => {
  try {
    // Extract credentials from the request body
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    // Respond with token
    res.status(200).json({ token, user, message: "LogIn Successfully" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
