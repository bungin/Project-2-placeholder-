import express from 'express';
import axios from 'axios';

const router = express.Router();
const MUSIXMATCH_API_KEY = process.env.MUSIXMATCH_API_KEY; // Ensure this is in your .env file

// Example endpoint to get lyrics
router.get('/lyrics', async (req, res) => {
    const { trackId } = req.query; // Get the track ID from query parameters

    if (!trackId) {
        return res.status(400).json({ error: 'Track ID is required' });
    }

    try {
        const response = await axios.get(`https://api.musixmatch.com/ws/1.1/track.lyrics.get`, {
            params: {
                track_id: trackId,
                apikey: MUSIXMATCH_API_KEY,
            },
        });

        const lyrics = response.data.message.body.lyrics;
        res.json(lyrics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching lyrics' });
    }
});

export default router;