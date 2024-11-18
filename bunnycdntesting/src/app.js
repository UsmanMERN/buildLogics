import express from "express";
// import multer from "multer";
import cors from "cors"
import dotenv from "dotenv";
import fileRoutes from "./routes/files.js";
import streamRoutes from "./routes/stream.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Routes
app.use("/api/files", fileRoutes);
app.use("/api/streams", streamRoutes);

app.get("/", (req, res) => {
    res.json({ message: "BunnyCDN Stream API" });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
