const dbConfig = require("../config/db");
const sql = require("mssql");
const resStatus = require("../utils/response_Status");

const getUserTodos = async (req, res) => {
  const { userId } = req.params;
  try {
    const DB = await sql.connect(dbConfig);
    if (DB._connected) {
      const req = new sql.Request();
      const { recordsets } = await req.query(
        `SELECT * FROM Todos WHERE userId = ${userId};`
      );
      if (recordsets[0].length > 0) {
        return res
          .status(200)
          .json({ status: resStatus.SUCCESS, data: recordsets[0] });
      } else {
        return res.status(200).json({ status: resStatus.SUCCESS, data: [] });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      staus: resStatus.ERROR,
      message: "Error when try to connect to database.",
    });
  }
};

const getSingleTodo = async (req, res, id) => {
  const { todoId } = req.params;
  const DB = await sql.connect(dbConfig);
  if (DB._connected) {
    const query = new sql.Request();
    const { recordset } = await query.query(
      `SELECT * FROM Todos WHERE id = ${id}`
    );
    if (recordset.length >= 1) {
      return res
        .status(200)
        .json({ status: resStatus.SUCCESS, data: recordset[0] });
    } else {
      res
        .status(404)
        .json({ status: resStatus.FAIL, message: "Todo not founded." });
    }
  } else {
    return res.status(500).json({
      status: resStatus.ERROR,
      message: "Error occured when connect to database.",
    });
  }
};

const addTodo = async (req, res) => {
  const { userId } = req.params;

  const DB = await sql.connect(dbConfig);
  if (DB._connected) {
    const dbQuery = new sql.Request();
    const exQ =
      await dbQuery.query(`INSERT INTO Todos (userId,title,description)
                           VALUES (${parseInt(userId)},'${req.body.title}','${
        req.body.description
      }');`);
    if (exQ.rowsAffected[0] >= 1) {
      return res.status(201).json({
        status: resStatus.SUCCESS,
        message: "Todo added successfully.",
      });
    }
    return res
      .status(400)
      .json({ status: resStatus.FAIL, message: "Faild to add todo." });
  } else {
    return res.status(500).json({
      status: resStatus.ERROR,
      message: "Error occured while connect to database.",
    });
  }
};

const deleteTodo = async (req, res) => {
  const { todoId } = req.params;
  const DB = await sql.connect(dbConfig);
  if (DB._connected) {
    const query = new sql.Request();
    const { recordset } = await query.query(
      `SELECT * FROM Todos WHERE id = ${todoId}`
    );
    if (recordset.length >= 1) {
      const { recordset } = await query.query(
        `DELETE FROM Todos WHERE id = ${todoId}`
      );
      return res.status(200).json({
        status: resStatus.SUCCESS,
        message: "Todo removed successfully.",
      });
    }

    return res
      .status(300)
      .json({ status: resStatus.FAIL, message: "Todo not founded." });
  } else {
    return res.status(500).json({
      status: resStatus.ERROR,
      message: "Error while connect to database.",
    });
  }
};

const markComplete = async (req, res) => {
  const { todoId } = req.params;
  const DB = await sql.connect(dbConfig);
  const query = new sql.Request();
  if (DB._connected) {
    const { rowsAffected } = await query.query(
      `UPDATE Todos SET isCompleted = 1 WHERE id=${todoId}`
    );
    if (rowsAffected[0] >= 1) {
      res.status(200).json({
        status: resStatus.SUCCESS,
        message: "Todo marked completed successfully.",
      });
    }
  } else {
    res
      .status(404)
      .json({ status: resStatus.FAIL, message: "Todo Not Founded." });
  }
};

const markNotCompleted = async (req, res) => {
  const { todoId } = req.params;
  const DB = await sql.connect(dbConfig);
  const query = new sql.Request();
  if (DB._connected) {
    const { rowsAffected } = await query.query(
      `UPDATE Todos SET isCompleted = 0 WHERE id=${todoId}`
    );
    if (rowsAffected[0] >= 1) {
      res.status(200).json({
        status: resStatus.SUCCESS,
        message: "Todo marked not completed successfully.",
      });
    }
  } else {
    res
      .status(404)
      .json({ status: resStatus.FAIL, message: "Todo Not Founded." });
  }
};

module.exports = {
  getUserTodos,
  getSingleTodo,
  addTodo,
  deleteTodo,
  markComplete,
  markNotCompleted,
};
