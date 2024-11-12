const express = require("express");
const knex = require("knex");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
const port = 5000;
app.use(cors({ origin: '*' }));

const db = knex(require("./knexfile").development);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from user-auth!");
});

//signup
app.post("/signup", async (req, res) => {
  const { username, password, full_name, city, country, email, mobile_number } =
    req.body;

  try {
    const user = await db("users").where({ username }).first();
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    await db("users").insert({
      username,
      password,
      full_name,
      city,
      country,
      email,
      mobile_number,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error in creating user:", err);
    res.status(500).json({ message: "Error creating user" });
  }
});

//login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db("users").where({ username }).first();

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});

//User details update
app.put("/update", async (req, res) => {
  const {
    oldUsername,
    oldPassword,
    newUsername,
    newPassword,
    full_name,
    city,
    country,
    email,
    mobile_number,
  } = req.body;

  try {
    const user = await db("users")
      .where({ username: oldUsername, password: oldPassword })
      .first();

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid old username or password" });
    }

    const updatedFields = {};

    if (newUsername) updatedFields.username = newUsername;
    if (newPassword) updatedFields.password = newPassword;
    if (full_name) updatedFields.full_name = full_name;
    if (city) updatedFields.city = city;
    if (country) updatedFields.country = country;
    if (email) updatedFields.email = email;
    if (mobile_number) updatedFields.mobile_number = mobile_number;

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No new information provided to update" });
    }

    await db("users").where({ username: oldUsername }).update(updatedFields);

    res.status(200).json({ message: "User details updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user details" });
  }
});

// User delete
app.delete("/delete", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db("users").where({ username, password }).first();

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    await db("users").where({ username }).del();

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user account" });
  }
});

//fetch user details
app.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await db("users").where({ username }).first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user details" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
