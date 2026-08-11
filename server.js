require("dotenv").config();
require("./src/events/taskEvents");
const app = require("./src/app");
require("./src/config/db");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`CampusOS server running on http://localhost:${PORT}`);
});