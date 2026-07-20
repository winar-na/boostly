require("dotenv").config();

const app = require("./src/app");
const pool = require("./src/database/db");

const PORT = process.env.PORT || 5000;

/*
--------------------------------------------------
START SERVER
--------------------------------------------------
*/
async function startServer() {
  try {
    /*
    TEST DATABASE CONNECTION
    */
    await pool.query("SELECT NOW()");

    console.log("✓ PostgreSQL connected successfully");

    /*
    START EXPRESS SERVER
    */
    app.listen(PORT, () => {
      console.log(
        `🚀 Boostly API running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "❌ Failed to connect to PostgreSQL"
    );

    console.error(error.message);

    process.exit(1);
  }
}

startServer();