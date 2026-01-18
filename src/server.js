require("dotenv").config();

const app = require("./app");
const { initSchema } = require("./models/schema");

initSchema();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`✅ Server running at http://localhost:${PORT}`);
});
