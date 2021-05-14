const express = require("express");
const connectDB = require("../backend/connection");
// const userRouter = require("../backend/API");
const user = require("./Models/User");
var bodyParser = require("body-parser");
const unix_converter = require("./utils");
var cors = require("cors");

require("dotenv").config;

connectDB();

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// app.use("/Models/event", userRouter);
app.use(express.json());
app.use(cors());

app.get("/events", function (req, res) {
  //Show all users
  console.log("Hello");
  user
    .find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/events/:id", function (req, res) {
  //Show 1st page events
  //Send back, list of dates of first page, user_time object filtered for first 7 days
  user
    .findById(req.params.id)
    .then((doc) => res.json(doc))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.post("/events/add", function (req, res) {
  //Add a new user
  console.log(req.body);
  const event_name = req.body.event_name;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const start_time = req.body.start_time;
  const end_time = req.body.end_time;
  const availability = unix_converter.create_users_time_obj(
    start_date,
    end_date,
    start_time,
    end_time
  );

  const newUser = new user({
    event_name,
    start_date,
    end_date,
    start_time,
    end_time,
    availability,
  });
  //Create users_time_object
  newUser
    .save()
    .then(() => res.json(newUser.id))
    .catch((err) => res.status(400).json("Error: " + err));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));