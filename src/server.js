const app = require("./app.js");
const config = require("./configs/envConfig.js");
const connectDB = require("./configs/dbConnect.js");

const server = app.listen(config.port, () => console.log(`Server Runing on port:${config.port}`));

// Database connection function
connectDB();

const graceFullShutdown = (signal) => {
    console.log(`\nRecieved ${signal}, shuting down gracefully..!`);

    server.close(() => {
        console.log("Server close, existing...");
        process.exit(0);
    });

    setTimeout(() => {
        console.log("Forcefully shutdown.");
        process.exit(1);
    }, 5000).unref();
};

process.on("unhandledRejection", (error) => {
    console.log(`unhandledRejection: ${error?.message || "unhandledRejection Error"}`);
    graceFullShutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
    console.log(`uncaughtException: ${error?.message || "uncaughtException Error"}`);
    graceFullShutdown("uncaughtException");
});
process.on("SIGINT", () => graceFullShutdown("SIGINT"));
process.on("SIGTERM", () => graceFullShutdown("SIGTERM"));