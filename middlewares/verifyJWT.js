const jwt = require("jsonwebtoken");
const resStatus = require("../utils/response_Status");

const verifyJWT = async (req, res, next) => {
  const authHeaders = req.headers.Authorization || req.headers.authorization;
  if (!authHeaders?.startsWith("Bearer ")) {
    return res.status(401).json({
      status: resStatus.FAIL,
      message: "Unauthorized",
    });
  }
  const token = authHeaders.split(" ")[1];
  const verify = await jwt.verify(token, process.env.JWT_SECRET);
  console.log(verify);
  if (verify) {
    next();
    return;
  }
  return res
    .status(403)
    .json({ status: resStatus.FAIL, message: "Token expired" });
};

module.exports = verifyJWT;
