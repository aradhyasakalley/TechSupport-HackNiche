const express = require("express");
const db = require("./utilities/connection");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

//requiring routes

// Initializing an express app
const app = express();

// Server Port
const PORT = process.env.PORT;

// Formatting incoming data and allowing cross origin requests
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging incoming requests
app.use(morgan("dev"));

// API Routes
// app.use("/user", user);

app.use((error, req, res, next) => {
    console.log("This is the rejected field ->", error.field);
});

// Test API
app.get("/api", (req, res) => {
    res.status(200).json({
        name: `${process.env.APP_NAME} API`,
        apiVersion: JSON.parse(fs.readFileSync("./package.json").toString())
            .version,
    });
});

// Listening on the port
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});