//jshint esversion:6
require('dotenv').config();
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
// const encrypt = require('mongoose-encryption'); (Step 1 Auth)
const bcrypt = require("bcrypt")
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localHost:27017/userDB")

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] }); (Step 1 auth)

const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {


  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets")
      }
    });

  });
});



app.post("/login", function(req, res) {
  const userName = req.body.username;
  const userPassword = req.body.password;

  User.findOne({
    email: userName
  }, function(err, foundEmail) {
    if (err) {
      console.log(err);
    } else {
      if (foundEmail) {
        bcrypt.compare(userPassword, foundEmail.password, function(err, result) {
          if(result===true){
            res.render("secrets")
          }

        });
      }
    }
  })
})


app.listen("3000", function(req, res) {
  console.log("Server is running on port 3000");
})
