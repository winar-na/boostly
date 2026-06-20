const express = require("express");

const usersRoutes = require("./routes/users.routes");
const postsRoutes = require("./routes/posts.routes");
const linksRoutes = require("./routes/links.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Boostly API");
});

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/links", linksRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;