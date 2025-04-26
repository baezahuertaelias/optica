require('dotenv').config()

const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
// Import routes
const routes = require("./routes");

const app = express();

// Middleware
const corsOptions = {
  origin: "*", // specify allowed origin(s)
  optionsSuccessStatus: 200, // some legacy browsers (IE11) choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/", routes);

// Database connection
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);


  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    await sequelize.sync();
    console.log("Database synced.");

  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

module.exports = app;
