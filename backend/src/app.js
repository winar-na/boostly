const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const usersRoutes = require("./routes/users.routes");
const postsRoutes = require("./routes/posts.routes");
const linksRoutes = require("./routes/links.routes");
const authRoutes = require("./routes/auth.routes");
const subscriptionsRoutes = require("./routes/subscriptions.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const errorHandler = require("./middleware/error.middleware");

const app = express();

/*
SECURITY HEADERS
*/
app.use(helmet());

/*
CROSS ORIGIN ACCESS
*/
app.use(
  cors({
    origin: "*"
  })
);

/*
BODY PARSER
*/
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Boostly API");
});

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/links", linksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/analytics", analyticsRoutes);

/*
GLOBAL ERROR HANDLER
MUST BE LAST
*/
app.use(errorHandler);

module.exports = app;