import express from "express";
import sequelize from "./config/connection.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(routes);

// Serve static files from the client's dist folder
app.use(express.static("../client/dist"));

// Sync database and start server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync the database:", error);
  });
