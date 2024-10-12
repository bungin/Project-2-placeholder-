import express, { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";

const router = express.Router();

// // Last.fm API root URL
// Documentation: http://ws.audioscrobbler.com/2.0/

let sessionKey: string | undefined;
router.get("/auth", (req: Request, res: Response) => {
  const apiKey = process.env.LASTFM_API_KEY;
  const callbackURL = process.env.CALLBACK_URL;
  const authUrl = `http://www.last.fm/api/auth/?api_key=${apiKey}&cb=${callbackURL}`;
  res.redirect(authUrl);
});

router.get("/callback", async (req: Request, res: Response) => {
  const token = req.query.token as string;
  const apiKey = process.env.LASTFM_API_KEY;
  const apiSecret = process.env.LASTFM_API_SECRET;

  const apiSig = crypto
    .createHash("md5")
    .update(`api_key${apiKey}methodauth.getSessiontoken${token}${apiSecret}`)
    .digest("hex");

  try {
    const response = await axios.get(
      `http://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${apiKey}&token=${token}&api_sig=${apiSig}&format=json`
    );
    sessionKey = response.data.session.key;
    res.sendFile(__dirname + "/../public/search.html");
  } catch (error) {
    res.status(404).send("Error fetching session key");
  }
});

// searching songs endpoint
router.post("/search", async (req: Request, res: Response) => {
  const { songName } = req.body;
  const apiKey = process.env.LASTFM_API_KEY;

  try {
    const response = await axios.get(
      `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(
        songName
      )}&api_key=${apiKey}&format=json`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error searching for songs");
  }
});

export { router as lfmRouter };
