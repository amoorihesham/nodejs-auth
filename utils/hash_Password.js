const bcrypt = require("bcrypt");

async function Hash_Password(password, salt) {
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

module.exports = Hash_Password;
