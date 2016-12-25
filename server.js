const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const connectionString = require("./config").mongoDBConnectionString;
// Connect to mongodb
mongoose.connect(connectionString);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", function () {
    console.log(`Mongoose default connection open to ${connectionString}`);
}); 

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  console.log(`Mongoose default connection error: ${err}`);
}); 

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection disconnected"); 
});

// If the Node process ends, close the Mongoose connection 
process.on("SIGINT", function() {
  mongoose.connection.close(function () {
    console.log("Mongoose default connection disconnected through app termination"); 
    process.exit(0); 
  }); 
}); 

app.use(express.static("./public"));
app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Session-Key");
  next();
});

app.use("/auth", require("./app/routes/authentication"));
app.use("/books", require("./app/routes/booksRouter"));
app.use("/users", require("./app/routes/usersRouter"));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running at localhost:${PORT}`);
});