import express from "express";

const app = express();
app.use(express.json());

// Example route
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Vercel!" });
});

// Export as default for Vercel
export default app;
