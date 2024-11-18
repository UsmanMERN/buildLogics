import { BunnyCdnStream } from "bunnycdn-stream";
import { config } from "dotenv";

config();

export const bunny = new BunnyCdnStream({
    apiKey: process.env.BUNNY_API_KEY,
    videoLibrary: process.env.BUNNY_VIDEO_LIBRARY,
});

export const baseUrl = `https://video.bunnycdn.com/library/${process.env.BUNNY_VIDEO_LIBRARY}`;
export const headers = {
    Authorization: `Bearer ${process.env.BUNNY_API_KEY}`, // Use "Bearer"
    "Content-Type": "application/json",
};
