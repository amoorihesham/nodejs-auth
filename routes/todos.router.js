const express = require("express");
const {
  getUserTodos,
  addTodo,
  markComplete,
  markNotCompleted,
  getSingleTodo,
  deleteTodo,
} = require("../controllers/todos.controllers");
const verifyJWT = require("../middlewares/verifyJWT");
const verifyAdmin = require("../middlewares/verifyAdmin");
const todosRouter = express.Router();

todosRouter.get("/todos/:userId", verifyJWT, getUserTodos);
todosRouter.post("/todos/:userId", verifyJWT, addTodo);

todosRouter.get("/todo/:todoId", verifyJWT, getSingleTodo);
todosRouter.delete("/todo/:todoId", verifyJWT, deleteTodo);
todosRouter.post("/todo/:todoId", verifyJWT, markComplete);
todosRouter.post("/todo/nc/:todoId", verifyJWT, markNotCompleted);

module.exports = todosRouter;
