import {APP_PORT, DB_URL} from "./config/index.js";
import express from "express";
import router from "./routes/index.js";
import errorHandler from "./middlwares/errorHandlers.js";
import mongoose from "mongoose";
const app = express();

// Database connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
	console.log("Connected to MongoDB");
});

app.use(express.json()); // to use the json data in req.body
app.use("/api", router);
app.use(errorHandler);
app.listen(APP_PORT, () => {
	console.log(`Server running on port ${APP_PORT} 🚀🚀🚀`);
});




// http://localhost:3000/api/me - after passing the token you will get the user details