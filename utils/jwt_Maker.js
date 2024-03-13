const jwt = require("jsonwebtoken");

async function getJWT({ firstName, lastName, email }) {
  const token = jwt.sign(
    { firstName, lastName, email, isAdmin: false },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  return token;
}

module.exports = getJWT;
