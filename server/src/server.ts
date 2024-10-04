import express from 'express';
import sequelize from './config/connection'; // No .js extension needed
import routes from './routes/index'; // Existing routes
import musixmatchRoutes from './routes/musixmatch'; // Import the Musixmatch routes

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(routes);
app.use('/api/musixmatch', musixmatchRoutes); // Use the Musixmatch API routes

// Serve static files from the client's dist folder
app.use(express.static('../client/dist'));

// Sync database and start server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to sync the database:', error);
});
