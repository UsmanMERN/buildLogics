import express from "express";
import multer from "multer";
import {
    uploadFile,
    listFiles,
    deleteFile,
    renameFile,
} from "../controllers/files.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary file storage

// Routes
router.post("/upload", upload.single("file"), uploadFile);
router.get("/", listFiles);
router.delete("/", deleteFile);
router.put("/rename", renameFile);

export default router;
