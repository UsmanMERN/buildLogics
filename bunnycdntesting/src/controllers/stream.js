import {
    uploadStreamVideo,
    listStreamVideos,
    getStreamVideo,
    deleteStreamVideo,
} from "../utils/bunnyStream.js";

import fs from "fs";
import axios from "axios";
import { config } from "dotenv";

config()


export const uploadVideo = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required." });
        }

        const optionsToCreateVideo = {
            method: "POST",
            url: `https://video.bunnycdn.com/library/${process.env.BUNNY_VIDEO_LIBRARY}/videos`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                AccessKey: process.env.BUNNY_API_KEY,
            },
            data: JSON.stringify({ title }),
        };

        const createResponse = await axios.request(optionsToCreateVideo);
        res.status(201).json({ message: "Video entry created", data: createResponse.data });
    } catch (error) {
        res.status(400).json({
            message: "Error creating video entry",
            error: error.response?.data || error.message,
        });
    }
};

export const getAllVideos = async (req, res) => {
    try {
        const videos = await listStreamVideos();
        res.status(200).json({ message: "Videos retrieved successfully", videos });
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos", error: error.message });
    }
};

export const getVideo = async (req, res) => {
    try {
        const { videoId } = req.params; // Get videoId from URL params
        const video = await getStreamVideo(videoId);
        res.status(200).json({ message: "Video retrieved successfully", video });
    } catch (error) {
        res.status(500).json({ message: "Error fetching video", error: error.message });
    }
};

export const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params; // Get videoId from URL params
        await deleteStreamVideo(videoId);
        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting video", error: error.message });
    }
};
