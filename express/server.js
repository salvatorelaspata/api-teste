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

// const { PythonShell } = require("python-shell");

// let options = {
//   mode: "text",
//   pythonPath: "python",
//   pythonOptions: ["-u"], // get print results in real-time
//   scriptPath: "./",
//   args: ["./img.psd"],
// };

router.get("/read_components", (req, res) => {
  console.log("/read_components");
  const spawn = require("child_process").spawn,
    py = spawn("python3", ["--version"], { shell: true }),
    data = ["./img.psd"];

  //console.log(py);

  let dataString = "";

  py.stdout.on("data", function (data) {
    dataString += data.toString();
    console.log("dataString - data", dataString);
  });

  py.stdout.on("end", function () {
    console.log("dataString - end", dataString);
    if (!dataString) return;
    /* var layer = JSON.parse(dataString);

    console.log(layer);
 */
    py.stdin.pause();
    py.stdin.destroy();

    res.send(dataString);
  });

  py.stdout.on("error", function (err) {
    console.log("error", err);
    if (err.code == "EPIPE") {
      py.exit(0);
    }
  });

  //py.stdin.write(JSON.stringify(data));

  py.stdin.end();

  // read(res);
});
/*
const read = (res) => 
{
  PythonShell.run("read_layer.py", options, function (err, results) {
    if (err) console.log(err);
    // results is an array consisting of messages collected during execution
    res.send(results);
    console.log("resultsssss: %j", results);
  });
}; 
*/
router.get("/another", (req, res) => res.json({ route: req.originalUrl }));
router.post("/", (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

// DEBUG
// app.listen(3000, () => console.log("Local app listening on port 3000!"));

module.exports = app;
module.exports.handler = serverless(app);
