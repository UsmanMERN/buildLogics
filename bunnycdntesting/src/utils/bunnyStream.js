import { bunny, baseUrl, headers } from "../bunny.js";
import fs from "fs";
import axios from "axios";
// import { } from "../bunny.js";

/**
 * Upload a video file to BunnyCDN Stream.
 * @param {string} filePath - Path to the video file.
 * @param {object} options - Options including video title.
 * @returns {Promise<object>}
 */


export const uploadStreamVideo = async (filePath, { title }) => {
    if (!fs.existsSync(filePath)) {
        throw new Error("File not found at provided path: " + filePath);
    }

    try {
        // Step 1: Create video entry
        const createVideoResponse = await axios.post(
            `${baseUrl}/videos`,
            { title }, // Body must include "title"
            { headers }
        );

        const { guid } = createVideoResponse.data;
        console.log("Video entry created with GUID:", guid);

        // Step 2: Upload video file
        const fileStream = fs.createReadStream(filePath);
        const uploadResponse = await axios.put(
            `${baseUrl}/videos/${guid}`,
            fileStream,
            {
                headers: {
                    ...headers,
                    "Content-Type": "application/octet-stream",
                },
                maxBodyLength: Infinity, // Support large file uploads
            }
        );

        console.log("Video uploaded successfully:", uploadResponse.data);
        return uploadResponse.data;
    } catch (error) {
        console.error("Error uploading video:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * List all videos from BunnyCDN Stream.
 * @returns {Promise<object[]>}
 */
export const listStreamVideos = async () => {
    const videos = await bunny.listVideos();
    return videos.items;
};

/**
 * Get details of a single video.
 * @param {string} videoId - Video GUID.
 * @returns {Promise<object>}
 */
export const getStreamVideo = async (videoId) => {
    const video = await bunny.getVideo(videoId);
    return video;
};

/**
 * Delete a video from BunnyCDN Stream.
 * @param {string} videoId - Video GUID.
 * @returns {Promise<boolean>}
 */
export const deleteStreamVideo = async (videoId) => {
    await bunny.deleteVideo(videoId);
    return true;
};
