const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

const usersRouter = require('./routes/users');
const gamesRouter = require('./routes/games')
// const { notFound, errorHandler } = require("./middleware/error");

//Connect to database
const dbUsername = "adma";
const dbPassword = "0fmCwX3yGNw2CthK";
const dbURI = `mongodb+srv://adma:${dbPassword}@${dbUsername}.bt1e7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(dbURI);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
  name: 'cookie',
  secret: 'longsecretstring',
  saveUninitialized: true,
  resave: true,
}));

//Middleware
app.use(express.json());
app.use(morgan("common"));
app.use(cors({ origin: "*" }));


//Routes
app.get("/", (req, res) => res.json("Hello"));
app.use("/users", usersRouter);
app.use('/games', gamesRouter);

//Error handling
// app.use(notFound);
// app.use(errorHandler);

//Listen
const port = 3000;
app.listen(port, () => console.log(`Listening at ${port}`));