const express = require("express");
const app = express();
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

dotenv.config();
mongoose
  .connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() => {
    console.log("backend connected");
  });

  
// middleware
app.use(express());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.use("/api/posts", postRoute);
app.get("/",(req,res) => {
        res.send("welcome to homepage");

} )

app.listen(3000, () => {
  console.log("Shit's runnin");
});
