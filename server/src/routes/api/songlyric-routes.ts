import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();
const MUSIXMATCH_API_KEY = "afc1218412feb3ab3e71e77eacf71011"; //process.env.MUSIXMATCH_API_KEY as string; // Type assertion, assuming it's a string

// Example endpoint to get lyrics
router.get('/lyrics', async (req: Request, res: Response): Promise<void> => {
    const { trackId } = req.query;

    if (!trackId) {
        res.status(400).json({ error: 'Track ID is required' });
        return;
    }
    console.log('here');
    try {
        //track.search?q_artist=rammstein&s_track_rating=desc&page_size=3
        const response = await axios.get(`https://api.musixmatch.com/track.search?q_artist=rammstein&s_track_rating=desc&page_size=3`, {
            params: {
                track_id: trackId,
                apikey: MUSIXMATCH_API_KEY,
            },
        });
        console.log(response);
        const lyrics = response.data?.message?.body?.lyrics?.lyrics_body;

        if (!lyrics) {
            res.status(404).json({ error: 'Lyrics not found' });
            return;
        }

        res.json({ lyrics });
    } catch (error) {
        console.error('Error fetching lyrics:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'An error occurred while fetching lyrics' });
    }
});

export default router;
