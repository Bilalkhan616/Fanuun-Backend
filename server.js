// Note: Main server file (Fanuun Project)

// Note: Importing required libraries...!
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

// Note: Database...!
const connectMongoDb = require("./src/database/db");

const UserApi = require('./routes/user')

dotenv.config({ path: "./.env" });

connectMongoDb();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.set("trust proxy", true);

app.use((req, res, next) => {
    console.log(`A request came: ${req.body}`);
    // console.log(`System Ip: ${req.ip}`);
    // console.log(`Secure ?: ${req.protocol}`);
    next();
});


app.get("/", (req, res) => {
    // console.log(`System Ip: ${req.ip}`);
    return res.send("<h1> Prince Ahmed is devloping the back-end of fanuun project! 🥰 </h1>");
});
app.use('/', UserApi);

app.listen(port, (req, res) => {
    console.log(`Server is running on http://localhost:${port}`);
});