const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("../backend/routes/userRoutes");
const bodyParser = require("body-parser");
const morgan = require("morgan");
dotenv.config();
var cors = require("cors");
const connectDB = require("./config/db");
connectDB();
const app = express();
const fileUpload = require("express-fileupload");

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//routes
app.use("/api/v1/users", userRoutes);

app.listen(process.env.PORT || 5003, () => {
  console.log("Server running....");
});
