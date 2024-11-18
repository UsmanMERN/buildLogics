import {
    uploadToBunny,
    listFromBunny,
    deleteFromBunny,
    renameOnBunny,
} from "../utils/bunnyCDN.js";
import fs from "fs";

// Upload a file to BunnyCDN
export const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No file provided" });

        const fileUrl = await uploadToBunny(file);
        fs.unlinkSync(file.path); // Clean up local file

        res.status(201).json({
            message: "File uploaded successfully",
            fileUrl,
        });
    } catch (error) {
        res.status(500).json({ message: "Error uploading file", error: error.message });
    }
};

// List files from BunnyCDN directory
export const listFiles = async (req, res) => {
    try {
        const { directory = "" } = req.query;
        const files = await listFromBunny(directory);

        res.status(200).json({
            message: "Files retrieved successfully",
            files,
        });
    } catch (error) {
        res.status(500).json({ message: "Error listing files", error: error.message });
    }
};

// Delete a file from BunnyCDN
export const deleteFile = async (req, res) => {
    try {
        const { remotePath } = req.body;
        if (!remotePath) return res.status(400).json({ message: "remotePath is required" });

        await deleteFromBunny(remotePath);

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting file", error: error.message });
    }
};

// Rename a file on BunnyCDN
export const renameFile = async (req, res) => {
    try {
        const { oldPath, newPath } = req.body;
        if (!oldPath || !newPath) {
            return res.status(400).json({ message: "oldPath and newPath are required" });
        }

        await renameOnBunny(oldPath, newPath);

        res.status(200).json({ message: "File renamed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error renaming file", error: error.message });
    }
};
