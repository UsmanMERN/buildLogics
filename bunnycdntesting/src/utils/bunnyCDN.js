import axios from "axios";
import fs from "fs";
import { config } from "dotenv";
config()


// BunnyCDN Base Config
const BASE_URL = `https://${process.env.BUNNY_REGION}.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}`;
const HEADERS = { AccessKey: process.env.BUNNY_API_KEY };

// console.log("BASE_URL:", BASE_URL);
// console.log("HEADERS:", HEADERS);
// Upload a file to BunnyCDN
export const uploadToBunny = async (file) => {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    const fileStream = fs.createReadStream(file.path);

    const url = `${BASE_URL}/${uniqueFileName}`;
    const response = await axios.put(url, fileStream, { headers: HEADERS });

    if (response.status === 201) {
        return `https://${process.env.BUNNY_PULL_ZONE}/${uniqueFileName}`;
    }
    throw new Error("Failed to upload file");
};

// List files in BunnyCDN directory
export const listFromBunny = async (directory = "") => {
    const url = `${BASE_URL}/${directory}`;
    const response = await axios.get(url, { headers: HEADERS });

    return response.data;
};

// Delete a file from BunnyCDN
export const deleteFromBunny = async (remotePath) => {
    const url = `${BASE_URL}/${remotePath}`;
    await axios.delete(url, { headers: HEADERS });
};

// Rename a file on BunnyCDN
export const renameOnBunny = async (oldPath, newPath) => {
    const oldFileUrl = `${BASE_URL}/${oldPath}`;
    const newFileUrl = `${BASE_URL}/${newPath}`;

    const response = await axios({
        method: "MOVE",
        url: oldFileUrl,
        headers: {
            ...HEADERS,
            Destination: newFileUrl,
        },
    });

    if (response.status !== 201) {
        throw new Error("Failed to rename file");
    }
};
