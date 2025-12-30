const mongoose = require("mongoose");
const config = require("./envConfig.js");

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(config.url);
        console.log(`Database connection successfully..!`);
    } catch (error) {
        console.log(`Database connection ERROR: ${error?.message || "DB Error"}`);
        throw new Error(error?.message || "");
    }
};

mongoose.connection.on("connected", () => console.log("Mongoose connected.."));
mongoose.connection.on("error", (err) => console.log(`Mongoose connection error: ${err?.message || ""}`));
mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected.."));

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log(`Mongoose Disconnected.`);
    process.exit(0);
});

module.exports = connectDB;