const express = require("express");
const app = express();
const userRouter = require("./routes/users.router.js");
const authRouter = require("./routes/auth.router");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const todosRouter = require("./routes/todos.router.js");

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", todosRouter);

app.listen(5001, () => {
  console.log("App Running On Port 5001");
});
