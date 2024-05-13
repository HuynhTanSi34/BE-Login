const express = require("express");
const user = express.Router();
const UserModel = require("./model/account");

var checkinput = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  next();
};

var dangky = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const newUser = await UserModel.registerUser(username, password);
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

user.post("/login", checkinput, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.loginUser(username, password);
    req.user = user;
    res.status(200).send("Login Success!");
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

user.post("/register", checkinput, dangky, (req, res) => {
  res.send("Register success!!");
});

user.get("/users", async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

user.post("/users", (req, res, next) => {
  res.send("Success!!");
});

user.put("/users/:id", (req, res) => {
  res.send("Success!!" + req.params.id);
});

user.get("/users/:id", (req, res) => {
  res.send(req.params.id);
});

user.delete("/users/:id", (req, res) => {
  res.send(req.params.id);
});

module.exports = user;
