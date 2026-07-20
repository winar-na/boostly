const { Pool } = require("pg");
require("dotenv").config();

/*
--------------------------------------------------
CHECK CURRENT ENVIRONMENT
--------------------------------------------------
*/
const isProduction =
  process.env.NODE_ENV === "production";

/*
--------------------------------------------------
DEVELOPMENT DATABASE CONFIGURATION
(Local PostgreSQL)
--------------------------------------------------
*/
const developmentConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

/*
--------------------------------------------------
PRODUCTION DATABASE CONFIGURATION
(Neon PostgreSQL)
--------------------------------------------------
*/
const productionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

/*
--------------------------------------------------
CREATE DATABASE CONNECTION POOL
--------------------------------------------------
*/
const pool = new Pool(
  isProduction
    ? productionConfig
    : developmentConfig
);

/*
--------------------------------------------------
DATABASE ERROR HANDLER
--------------------------------------------------
*/
pool.on("error", (err) => {
  console.error(
    "Unexpected PostgreSQL error:",
    err
  );
});

/*
--------------------------------------------------
EXPORT DATABASE POOL
--------------------------------------------------
*/
module.exports = pool;