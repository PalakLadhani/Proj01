const express = require("express");
const { connectMongoDb } = require("./connection");

const { logReqRes } = require("./middlewares");

const userRouter = require("./routes/user");
const app = express();
const PORT = 8000;

connectMongoDb(" mongodb://127.0.0.1:27017/Palak19");

// Connection
mongoose.connect("mongodb://127.0.0.1:27017/Palak19");

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use(logReqRes("log.txt"));

// Routes
app.use("/user", userRouter);
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
