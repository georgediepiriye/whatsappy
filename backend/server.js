const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.listen(process.env.PORT || 5003, () => {
  console.log("Server running....");
});
