const bodyParser = require("body-parser");
const session = require('express-session');
const express = require("express");
const usersRoutes = require('./routes/usersController');
const cors = require('cors');
var MongoDBStore = require('connect-mongodb-session')(session);
let port = process.env.PORT || 5500;
require("./models/dbConfig");

const app = express();

const store = new MongoDBStore({
    uri: 'mongodb+srv://dtdbmgdb:xCQ1MHr8WbiQdXG4@cluster0.l9hpw.mongodb.net/node-login?retryWrites=true&w=majority',
    collection: 'mySessions'
  });

// Catch errors
store.on('error', function(error) {
    console.log(error);
  });

app.use((req, res, next) => {
    console.log(store.sessions);
    next()
})

app.use(session({
    secret: "theSecretKey",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        expires: 1000 * 60 * 60 * 24,
    }
}))


app.use(express.json());

/**
 * Change here your localhost location
 */
app.use(cors({
    origin: "https://test-front-office-api.herokuapp.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,

}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', usersRoutes);

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.listen(port, () => console.log("Server is alive on 5500"));
