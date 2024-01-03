require("dotenv").config();
const express = require('express');
const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const verifyToken = require("./middlewares/verifyToken");
const jwt = require("jsonwebtoken");
const app = express();
const router = jsonServer.router('db/contacts.json');
const middlewares = jsonServer.defaults();

app.use(bodyParser.json());
app.use(middlewares);
app.use("/contacts", verifyToken);
app.use("/login", (req, res) => {
  const { login, password } = req.body;
  if (login === "root" && password === "Default-123") {
    const token = jwt.sign({ id: 1, nickName: "root", login }, process.env.TOKEN_SECRET);
    return res.send({ token });
  }
  if (login === "user" && password === "Password-123") {
    const token = jwt.sign({ id: 2, nickName: "usr1", login }, process.env.TOKEN_SECRET);
    return res.send({ token });
  }
  return res.status(401).send({ msg: "Unathorized" });

});

app.use("/me", [verifyToken], (req, res) => {
  const { id, nickName } = req.user;
  return res.send({ id, nickName });
});

app.use(router);


const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
