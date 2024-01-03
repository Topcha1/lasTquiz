require("dotenv").config();
const express = require('express');
const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const verifyToken = require("./middlewares/verifyToken");
const jwt = require("jsonwebtoken");
const app = express();
const router = jsonServer.router('db/contacts.json');
const middlewares = jsonServer.defaults();
const fs = require('fs');

app.use(bodyParser.json());
app.use(middlewares);

app.delete("/contacts/:id", verifyToken, (req, res, next) => {
  const user_id = req.user.id;
  const { contacts } = require('./db/contacts.json');
  const userContacts = contacts.filter(contact => contact.user_id === user_id);
  const contactIdToDelete = parseInt(req.params.id);
  console.log("contactIdToDelete", contactIdToDelete);
  const isUserContact = userContacts.find(contact => contact.id === contactIdToDelete);
  if (!isUserContact) {
    return res.status(403).send({ msg: 'You are not allowed to delete this contact' });
  }
  return next();
});


app.post("/contacts", verifyToken);

app.post("/create", verifyToken, (req,res,next) => {
  fs.readFile('./db/contacts.json', 'utf8', (err, data) => {
    const parsedContacts = JSON.parse(data);

    const payload = {
      ...req.body,
      id: parsedContacts.contacts.length + 1,
    };

    parsedContacts.contacts.push(payload);

    const updatedContacts = JSON.stringify(parsedContacts, null, 2);

    fs.writeFile('./db/contacts.json', updatedContacts, () => {});
  });

  return res.send({ status: 'Success' });
});

app.put("/update/:contactId", verifyToken, (req,res,next) => {
  fs.readFile('./db/contacts.json', 'utf8', (err, data) => {
    const parsedContacts = JSON.parse(data);

    const mappedContacts = parsedContacts.contacts.map(c => {
      if(c.id === req.body.userData.id ) {
        c.name = req.body.userData.name
        c.phoneNumber = req.body.userData.phoneNumber
      }
      return {
        ...c
      }
    })
    parsedContacts.contacts = []

    parsedContacts.contacts = mappedContacts;

    const updatedContacts = JSON.stringify(parsedContacts, null, 2);

    fs.writeFile('./db/contacts.json', updatedContacts, () => {});
  });

  return res.send({ status: 'Success' });
});

app.delete("/delete/:contactId", verifyToken, (req,res,next) => {
  fs.readFile('./db/contacts.json', 'utf8', (err, data) => {
    const contactId = req.params.contactId
    const parsedContacts = JSON.parse(data);

    parsedContacts.contacts  = parsedContacts.contacts.filter(item => item.id !== +contactId)

    const updatedContacts = JSON.stringify(parsedContacts, null, 2);

    fs.writeFile('./db/contacts.json', updatedContacts, () => {});
  });

  return res.send({ status: 'Success' });
});

app.post("/delete/many", verifyToken, (req,res,next) => {
  fs.readFile('./db/contacts.json', 'utf8', (err, data) => {
    const ids = new Set(req.body.ids)
    const parsedContacts = JSON.parse(data);

    parsedContacts.contacts  = parsedContacts.contacts.filter(item => !ids.has(item.id))

    const updatedContacts = JSON.stringify(parsedContacts, null, 2);

    fs.writeFile('./db/contacts.json', updatedContacts, () => {});
  });

  return res.send({ status: 'Success' });
});


app.delete("/contacts/", verifyToken, (req, res, next) => {
  const user_id = req.user.id;
  const { contacts } = require('./db/contacts.json');
  const userContacts = contacts.filter(contact => contact.user_id === user_id);
  const { idsArr } = req.body;
  const userContants = [];

  if (!isUsersContacts) {
    return res.status(403).send({ msg: 'You are not allowed to delete this contact' });
  }
  return next();
});

app.get("/contacts", verifyToken, (req, res, next) => {
  const user_id = req.user.id;

  const { contacts } = require('./db/contacts.json');
  const userContacts = contacts.filter(contact => contact.user_id === user_id);

  if (req.method === 'GET') {
    return res.send(userContacts);
  }
  return next();
});

app.post("/login", (req, res) => {
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

app.get("/me", [verifyToken], (req, res) => {
  const { id, nickName } = req.user;
  return res.send({ id, nickName });
});

app.use(router);


const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
