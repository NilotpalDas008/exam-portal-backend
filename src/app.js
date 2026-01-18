const express = require("express");
const cors = require("cors");

const studentRoute = require("./routes/studentRoute");
const examRoute = require("./routes/examRoute");
const sessionRoute = require("./routes/sessionRoute");
const { adminSeed } = require("./controllers/examController");
const validate = require("./middlewares/validate");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoute);
app.use("/api/exams", examRoute);
app.use("/api/sessions", sessionRoute);
app.post("/api/admin/seed", validate([]), adminSeed);

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
