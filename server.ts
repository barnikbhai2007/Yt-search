import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import searchHandler from "./api/search";
import musicHandler from "./api/music";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/search", searchHandler);
  app.get("/api/music", musicHandler);
  
  // Shorter paths for consistency with vercel.json
  app.get("/search", searchHandler);
  app.get("/music", musicHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
