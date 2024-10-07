import { Router } from "express";
import { userRouter } from "./user-routes.js";
import { lfmRouter } from "./lastfm.js";
// import { carsRouter } from './cars-routers.js'; example

const router = Router();

// /api/users
router.use("/users", userRouter);
// router.use('/cars', carsRouter); example of new routes

router.use("/music", lfmRouter);

export default router;
