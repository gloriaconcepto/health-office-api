const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const usersRoutes = require("./routes/userAppRoutes/userDetailsRoute");
const mongoDbLink = process.env.MONGOOSE_URL;
console.log(mongoDbLink);
app.use(bodyParser.json()); // application/json
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/users", usersRoutes);

app.use((error, req, res, next) => {
    console.log("error:");
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

//setting up the server and port
const connectDb = async () => {
    mongoose
        .connect(mongoDbLink)
        .then((result) => {
            app.listen(8080, function () {
                console.log("am connected to the db");
                console.log("listening on 8080");
            });
        })
        .catch((err) => console.log(err));
};

connectDb();
