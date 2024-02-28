const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;
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

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "sucess", id: users.length });
  });
  //TODO:Create new user
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
