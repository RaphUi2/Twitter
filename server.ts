import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "db.json");

// Initial data if DB doesn't exist
const INITIAL_DATA = {
  tweets: [],
  users: []
};

// Helper to read/write DB
const readDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    return INITIAL_DATA;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
};

const writeDB = (data: any) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/tweets", (req, res) => {
    const db = readDB();
    res.json(db.tweets);
  });

  app.post("/api/tweets", (req, res) => {
    const db = readDB();
    const newTweet = {
      ...req.body,
      id: `tweet-${Date.now()}`,
      timestamp: new Date().toISOString(),
      likes: [],
      retweets: [],
      replies: []
    };
    db.tweets.unshift(newTweet);
    writeDB(db);
    res.status(201).json(newTweet);
  });

  app.get("/api/users", (req, res) => {
    const db = readDB();
    res.json(db.users);
  });

  app.post("/api/users/login", (req, res) => {
    const { email } = req.body;
    const db = readDB();
    const user = db.users.find((u: any) => u.email === email || u.username === email);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "User not found" });
    }
  });

  app.post("/api/users/signup", (req, res) => {
    const db = readDB();
    const newUser = {
      ...req.body,
      id: `user-${Date.now()}`,
      joinDate: new Date().toISOString(),
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      isVerified: false
    };
    db.users.push(newUser);
    writeDB(db);
    res.status(201).json(newUser);
  });

  app.post("/api/tweets/:id/like", (req, res) => {
    const { userId } = req.body;
    const db = readDB();
    const tweet = db.tweets.find((t: any) => t.id === req.params.id);
    if (tweet) {
      const index = tweet.likes.indexOf(userId);
      if (index === -1) {
        tweet.likes.push(userId);
      } else {
        tweet.likes.splice(index, 1);
      }
      writeDB(db);
      res.json(tweet);
    } else {
      res.status(404).json({ error: "Tweet not found" });
    }
  });

  app.post("/api/tweets/:id/retweet", (req, res) => {
    const { userId } = req.body;
    const db = readDB();
    const tweet = db.tweets.find((t: any) => t.id === req.params.id);
    if (tweet) {
      const index = tweet.retweets.indexOf(userId);
      if (index === -1) {
        tweet.retweets.push(userId);
      } else {
        tweet.retweets.splice(index, 1);
      }
      writeDB(db);
      res.json(tweet);
    } else {
      res.status(404).json({ error: "Tweet not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
