import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("", async (req: Request, res: Response) => {
  const query = req.query.q_track;

  try {
    const response = await axios.get(
      `https://api.musixmatch.com/ws/1.1/track.search`,
      {
        params: {
          q_track: query,
          apikey: process.env.MUSIXMATCH_API_KEY, // Musixmatch API key
        },
      }
    );
    res.json(response.data.message.body); // Send back the song list
  } catch (error) {
    console.error("Error fetching songs from Musixmatch API", error);
    res.status(500).send("Error fetching songs");
  }
});

export default router;
