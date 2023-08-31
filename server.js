const express = require("express")
const bodyParser = require("body-parser")
const UserApi = require('./routes/user')
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config({ path: "./.env" }); // Load environment variables

mongoose.connect(process.env.MONGODB_URI, {
}).then(res => {
    console.log("Connected to MongoDB Atlas database");
}).catch(err => {
    console.log("Error connecting to MongoDB:", err);
});

const app = express()
app.use(cors())
app.use(bodyParser.json())

let port = process.env.PORT || 5050

app.use('/', UserApi)

app.get("/", async (req, res) => {
    console.log("Base Url Loaded");
    res.send({
        status: true,
        message: "Base Url Loadedd"
    })
})
app.listen(port, (req, res) => {
    console.log(`listen tooo ${port} `);
});