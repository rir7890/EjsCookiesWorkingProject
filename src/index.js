const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const { rename } = require("fs");
const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  // console.log("welcome to simple http cookie server");
  // res.send("hello world");
  let username = req.cookies.username;
  return res.render("home", {
    username,
  });
});

app.get("/login", (req, res) => {
  let bad_auth = req.query.msg ? true : false;
  if (bad_auth) {
    return res.render("login", {
      error: "invalid username or password",
    });
  } else {
    return res.render("login");
  }
});

app.get("/welcome", (req, res) => {
  let username = req.cookies.username;
  return res.render("welcome", {
    username,
  });
});

app.post("/process_login", (req, res) => {
  let { username, password } = req.body;
  let userdetails = {
    username: "bob",
    password: "123456",
  };
  if (
    username === userdetails["username"] &&
    password === userdetails["password"]
  ) {
    res.cookie("username", username, {
      httpOnly: true,
      sameSite: true,
      secure: true,
    });
    return res.redirect("/welcome");
  } else {
    return res.redirect("/login?msg=fail");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("username");
  return res.redirect("/login");
});

app.listen(PORT, () => {
  console.log("server started at the port 4000");
});

// app.get("/setcookie", (req, res) => {
//   res.cookie("cookie token name", "encrypted cookie string value", {
//     maxAge: 5000,
//     expires: new Date("01 12 2021"),
//     secure: true,
//     httpOnly: true,
//     sameSite: "lax",
//   });
//   res.send("cookie have been saved successfully");
// });

// app.get("/getcookie", (req, res) => {
//   console.log(req.cookies);
//   res.send(req.cookies);
// });

// app.get("/deletecookie", (req, res) => {
//   res.clearCookie();
//   res.send("cookies have been cleared");
// });

// app.listen(3000, () => {
//   console.log("the server is running port 3000......");
// });
