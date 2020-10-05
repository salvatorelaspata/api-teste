"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

const router = express.Router();

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});

router.get("/read_components", (req, res) => {
  const spawn = require("child_process").spawn,
    py = spawn("python", ["read_layer.py", "img.psd"]);
  let dataString = "";

  py.stdout.on("data", function (data) {
    dataString += data.toString();
  });

  py.stdout.on("end", function () {
    if (!dataString) return;
    var layer = JSON.parse(dataString);
    console.log(layer);
    py.stdin.pause();
    py.stdin.destroy();
    res.send("C SEMU!");
  });

  py.stdin.end();
  //py.stdin.write(JSON.stringify(data));
});

router.get("/another", (req, res) => res.json({ route: req.originalUrl }));
router.post("/", (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

// DEBUG
// app.listen(3000, () => console.log("Local app listening on port 3000!"));

module.exports = app;
module.exports.handler = serverless(app);
