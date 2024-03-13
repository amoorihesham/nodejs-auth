
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.BD_SERVER,
  database: process.env.DB_NAME,
  trustServerCertificate: true,
};

module.exports = config;
