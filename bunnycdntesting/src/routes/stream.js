// import express from "express";
// import multer from "multer";
// import {
//     uploadVideo,
//     getAllVideos,
//     getVideo,
//     deleteVideo,
// } from "../controllers/stream.js";

// const router = express.Router();
// const upload = multer({ dest: "uploads/" }); // Multer for file upload

// // Upload a video
// router.post("/upload", upload.single("file"), uploadVideo);

// // List all videos
// router.get("/", getAllVideos);

// // Get a single video
// router.get("/:videoId", getVideo);

// // Delete a video
// router.delete("/:videoId", deleteVideo);

// export default router;

import express from "express";
import multer from "multer";
import {
    uploadVideo,
    getAllVideos,
    getVideo,
    deleteVideo,
} from "../controllers/stream.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Multer for file upload

// Upload a video
router.post("/upload", upload.single("file"), uploadVideo);

// List all videos
router.get("/", getAllVideos);

// Get a single video
router.get("/:videoId", getVideo);

// Delete a video
router.delete("/:videoId", deleteVideo);

export default router;
