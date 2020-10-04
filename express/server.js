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
  console.log("/read_components");
  const spawn = require("child_process").spawn;
  const py = spawn("python", ["read_layer.py"], {
    env: {
      NODE_ENV: "production",
      PATH: process.env.PATH,
    },
  });
  const data = ["Senza titolo-1.psd"]; //sostituire con

  let dataString = "";

  py.stdout.on("data", function (data) {
    console.log("data", data);
    dataString += data.toString();
  });

  py.stdout.on("end", function () {
    if (!dataString) return;
    console.log("layer", dataString);
    var layer = JSON.parse(dataString);
    console.log(layer);
    res.send("C SEMU!");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
  py.stdin.pause();
  py.stdin.destroy();
});

router.get("/another", (req, res) => res.json({ route: req.originalUrl }));
router.post("/", (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

// DEBUG
//app.listen(3000, () => console.log("Local app listening on port 3000!"));

module.exports = app;
module.exports.handler = serverless(app);
