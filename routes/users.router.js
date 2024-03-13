const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controllers");
const verifyJWT = require("../middlewares/verifyJWT");
const verifyAdmin = require("../middlewares/verifyAdmin");

const userRouter = express.Router();

userRouter.get("/users", verifyJWT, verifyAdmin, getAllUsers);
userRouter.get("/users/:userId", verifyJWT, verifyAdmin, getSingleUser);
userRouter.patch("/users/:userId", verifyJWT, verifyAdmin, updateUser);
userRouter.delete("/users/:userId", verifyJWT, verifyAdmin, deleteUser);

module.exports = userRouter;
