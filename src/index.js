const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const usersRouter = require('./routes/users');
const gamesRouter = require('./routes/games');
const deliveriesRouter = require('./routes/deliveries');
const ordersRouter = require('./routes/orders');
const uploadsRouter = require('./routes/uploads');
const getAction = require("./middleware/getAction");

//Connect to database
const dbPassword = env.PASSWORD;
const dbURI      = env.URI.replace('<password>', dbPassword);
mongoose.connect(dbURI);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(express.static('src/uploads'));
app.use(express.static('src/public'));

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
app.use(getAction);
app.use(express.json());
app.use(morgan("common"));
app.use(cors({ origin: "*" }));

//Routes
app.get(["/", "/login"], (req, res) => res.render('guest/login'));
app.use("/users", usersRouter);
app.use('/games', gamesRouter);
app.use('/deliveries', deliveriesRouter);
app.use('/orders', ordersRouter);
app.use('/uploads', uploadsRouter);

//Listen
const port = 3000;
app.listen(port, () => console.log(`Listening at ${port}`));
