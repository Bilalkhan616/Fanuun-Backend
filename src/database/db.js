// Note: Database configuration file...!

const mongoose = require("mongoose");

const connectMongoDb = async () => {

    try {
        let isDbConnected = await mongoose.connect(
            process.env.MONGO_DB_CONNECTION_URL,
            {
                dbName: "Fanuun-Project"
            }
        );

        isDbConnected && console.log(`Mongo DB connected successfully!`);
    }

    catch (error) {
        console.log(`Something went wrong while connecting to database: ${error}`);
    };
};

module.exports = connectMongoDb;