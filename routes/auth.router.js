const express = require("express");
const {
  Register,
  Login,
  RefreshToken,
} = require("../controllers/auth.controllers");

const authRouter = express.Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.get("/refresh/token", RefreshToken);

module.exports = authRouter;
