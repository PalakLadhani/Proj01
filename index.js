const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

const users = require("./MOCK_DATA.json");
const { stringify } = require("querystring");
const app = express();
const PORT = 8000;

//Connection

mongoose
  .connect("mongodb://127.0.0.1:27017/Palak19", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error", err));
//Schema

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobTitle: {
    type: String,
  },
  gender: {
    type: String,
  },
});

const User = mongoose.model("user", userSchema);
//Middleware -Plugin
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  // console.log("Hello from middleware 1");
  fs.appendFile(
    "log.txt",
    `${Date.now()}: ${req.method}: ${req.path}\n`,
    (err, data) => {
      next();
    }
  );
  // return res.json({ msg: "Hello from middleware 1" });
  next();
});

//Routes
app.get("/users", (req, res) => {
  const html = `
  <ul>
  ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
 
  </ul>
  `;
  res.send(html);
});

//REST API
app.get("/api/users", (req, res) => {
  res.setHeader("X-myName", "Shivam Asati"); //custom headers
  //Always add X to custom headers
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);
  })
  .patch((req, res) => {
    //edit user with id
    return res.json({ status: "Pending" });
  })
  .delete((req, res) => {
    //delete user with id
    return res.json({ status: "Pending" });
  });

app.post("/api/users", async (req, res) => {
  const body = req.body;

  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "all feilds arae req..." });
  }
  try {
    const result = await User.create({
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      gender: body.gender,
      jobTitle: body.job_title,
    });

    console.log("result", result);

    return res.status(201).json({ msg: "success" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
