const dbConfig = require("../config/db");
const sql = require("mssql");
const resStatus = require("../utils/response_Status");

const getAllUsers = (request, response) => {
  sql.connect(dbConfig, (err) => {
    if (err) console.log(err);

    let req = new sql.Request();
    req.query("select * from Users", (err, records) => {
      if (err) console.log(err);

      response.json(records).status(200);
    });
  });
};

const getSingleUser = (request, res) => {
  sql.connect(dbConfig, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    let req = new sql.Request();
    req.query(
      `select * from Users where id =${+request.params.userId}`,
      (err, records) => {
        if (err) {
          console.log(err);
          return;
        }

        res.json(records).status(200);
      }
    );
  });
};

const deleteUser = (request, res) => {
  sql.connect(dbConfig, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    let req = new sql.Request();
    req.query(
      `DELETE FROM Users WHERE id=${+request.params.userId}`,
      (err, dbRes) => {
        if (err) {
          console.log(err);
          return;
        }

        if (parseInt(dbRes.rowsAffected) >= 1) {
          res.status(201).json({ ...dbRes, msg: "User Deleted Succsessfully" });
        } else {
          res.status(400).json({ msg: "Something went wrong." });
        }
      }
    );
  });
};

const updateUser = (request, res) => {
  sql.connect(dbConfig, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    let req = new sql.Request();
    req.query(
      `UPDATE Users
        SET firstName = '${request.body.firstName.toString()}', lastName = '${request.body.lastName.toString()}'
        WHERE id=${+request.params.userId};`,
      (err, dbRes) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(dbRes);
        if (parseInt(dbRes.rowsAffected) >= 1) {
          res.status(201).json({ ...dbRes, msg: "User Updated Succsessfully" });
        } else {
          res.status(400).json({ msg: "Something went wrong." });
        }
      }
    );
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,

  updateUser,
  deleteUser,
};
