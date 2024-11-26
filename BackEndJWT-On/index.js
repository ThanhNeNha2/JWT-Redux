const express = require("express");
const mongoose = require("mongoose");
const auth = require("./src/Router/auth");
const user = require("./src/Router/user");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const app = express();

const port = process.env.PORT || 8000;

app.use(
  express.urlencoded({
    extended: true,
  })
);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_MONGOOSE);
    console.log("Connected to DB");
  } catch (err) {
    console.error("Error connecting to DB", err);
    process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
  }
};
connectDB();
app.use(cookieParser());
app.use("/v1/auth", auth);
app.use("/v1/user", user);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
