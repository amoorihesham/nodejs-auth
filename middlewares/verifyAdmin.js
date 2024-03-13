const jwt = require("jsonwebtoken");
const resStatus = require("../utils/response_Status");

const verifyAdmin = async (req, res, next) => {
  const authHeaders = req.headers.Authorization || req.headers.authorization;
  if (!authHeaders?.startsWith("Bearer ")) {
    return res.status(401).json({
      status: resStatus.FAIL,
      message: "Unauthorized please login.",
    });
  }
  const token = authHeaders.split(" ")[1];
  const verify = await jwt.verify(token, process.env.JWT_SECRET);
  if (verify?.isAdmin) {
    next();
    return;
  }
  return res
    .status(403)
    .json({ status: resStatus.FAIL, message: "Forbidden admins only." });
};

module.exports = verifyAdmin;
