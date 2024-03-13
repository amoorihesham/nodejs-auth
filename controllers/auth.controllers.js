const dbConfig = require("../config/db");
const sql = require("mssql");
const resStatus = require("../utils/response_Status");
const getJWT = require("../utils/jwt_Maker");
const jwt = require("jsonwebtoken");

const Register = async (request, res) => {
  try {
    await sql.connect(dbConfig);

    let dbReq = new sql.Request();

    // QUERY FOR CHECK IF EMAIL ADDRESS EXIST IN DATABASE OR NOT
    dbReq.query(
      `SELECT *
       FROM Users 
       WHERE email='${request.body.email}';`,
      async (err, dbResponse) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status: resStatus.ERROR,
            message:
              "An error occured when try to check if email in use or not.",
          });
        }

        if (parseInt(dbResponse.rowsAffected) >= 1) {
          return res.status(400).json({
            status: resStatus.FAIL,
            message: "This Email Address Is Already Exist.",
          });
        } else {
          // QUERY TO HANDLE ADD NEW USER TO DATABASE
          dbReq.query(
            `INSERT INTO Users (firstName,lastName,password,Email)
             VALUES
             ('${request.body.firstName}',
             '${request.body.lastName}',
             '${request.body.password}',
             '${request.body.email}');`,
            async (err, dbResponse) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  status: resStatus.ERROR,
                  message:
                    "An error occured when try to insert new user in database.",
                });
              }
              if (parseInt(dbResponse.rowsAffected) >= 1) {
                res.status(201).json({
                  status: resStatus.SUCCESS,
                  message: "User Registered Succsessfully",
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: resStatus.ERROR,
      message: "An error occured when trying to connect to database.",
    });
  }
};

const Login = async (request, res) => {
  try {
    await sql.connect(dbConfig);

    let dbReq = new sql.Request();

    // QUERY FOR CHECK IF EMAIL ADDRESS EXIST IN DATABASE OR NOT
    dbReq.query(
      `SELECT *
         FROM Users 
         WHERE email='${request.body.email}';`,
      async (err, dbResponse) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status: resStatus.ERROR,
            message:
              "An error occured when try to check if email in use or not.",
          });
        }

        if (parseInt(dbResponse.rowsAffected) >= 1) {
          if (
            `${request.body.password}` ==
            `${dbResponse.recordsets[0][0].password}`
          ) {
            const user = {
              id: dbResponse.recordsets[0][0].id,
              firstName: dbResponse.recordsets[0][0].firstName,
              lastName: dbResponse.recordsets[0][0].lastName,
              email: dbResponse.recordsets[0][0].email,
              isAdmin: dbResponse.recordsets[0][0].isAdmin,
              createdAt: dbResponse.recordsets[0][0].createdAt,
            };
            const token = await jwt.sign(user, process.env.JWT_SECRET, {
              expiresIn: "30m",
            });
            const refreshToken = jwt.sign(
              { ...request.body, isAdmin: false },
              process.env.JWT_REFRESH_TOKEN_SECRET,
              {
                expiresIn: "7d",
              }
            );
            res.cookie("jwt", refreshToken, {
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
              status: resStatus.SUCCESS,
              data: {
                token: token,
              },
            });
          } else {
            return res.status(401).json({
              status: resStatus.FAIL,
              message: "Password Wrong.",
              data: {},
            });
          }
        } else {
          return res.status(401).json({
            status: resStatus.FAIL,
            message: "Email address not registerd in our database.",
            data: {},
          });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: resStatus.ERROR,
      message: "An error occured when trying to connect to database.",
    });
  }
};

const RefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res
      .status(401)
      .json({ status: resStatus.FAIL, message: "Unauthoraized. ttt" });

  const refToken = cookies.jwt;
  jwt.verify(
    refToken,
    process.env.JWT_REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ status: resStatus.FAIL, message: "Forbidden." });
      }
      try {
        const userEmail = decoded.email;

        await sql.connect(dbConfig);

        let dbReq = new sql.Request();
        dbReq.query(
          `SELECT id,firstName,lastName,email,createdAt,isAdmin FROM Users WHERE email='${userEmail}';`,
          async (err, dbRes) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                status: resStatus.ERROR,
                message:
                  "An error occured when try to get user data from database.",
              });
            }

            if (
              parseInt(dbRes.rowsAffected) > 1 ||
              parseInt(dbRes.rowsAffected) < 1
            ) {
              return res.status(400).json({
                status: resStatus.FAIL,
                message: "Dublicates founded.",
              });
            } else {
              const newToken = await jwt.sign(
                dbRes.recordset[0],
                process.env.JWT_SECRET,
                { expiresIn: "30m" }
              );
              return res
                .status(200)
                .json({ status: resStatus.SUCCESS, data: { token: newToken } });
            }
          }
        );
      } catch (err) {
        console.log(err.message);
      }
    }
  );
};

module.exports = { Register, Login, RefreshToken };
