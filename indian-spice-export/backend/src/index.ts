import dotenv from "dotenv";
import { createApp } from "./app.js";

// Load environment variables
dotenv.config();

const port = process.env.PORT || 5000;
const app = createApp();

app.listen(port, () => {
  console.log(`[ISE Backend] Indian Spice Export API server running on port ${port}`);
  console.log(`[ISE Backend] Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`[ISE Backend] Health check available at: http://localhost:${port}/api/health`);
});
