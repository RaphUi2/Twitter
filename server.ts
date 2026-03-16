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
  tweets: [
    {
      id: 'tweet-1',
      userId: 'user-1',
      content: 'React 19 is absolutely game-changing! The new hooks are so clean. #ReactJS #WebDev',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      likes: ['user-2', 'user-3'],
      retweets: ['user-4'],
      replies: [],
      media: ['https://picsum.photos/seed/react/800/450'],
      isPinned: true
    },
    {
      id: 'tweet-2',
      userId: 'user-4',
      content: 'BREAKING: New breakthrough in sustainable energy announced today. A huge step for humanity! 🌱',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      likes: ['user-1', 'user-5'],
      retweets: ['user-1', 'user-2', 'user-3'],
      replies: [],
    },
    {
      id: 'tweet-3',
      userId: 'user-2',
      content: 'Just finished a new UI kit for dark mode lovers. What do you think? 🖤',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      likes: ['user-1', 'user-3', 'user-4', 'user-5'],
      retweets: [],
      replies: [],
      media: ['https://picsum.photos/seed/ui/800/450'],
    }
  ],
  users: [
    {
      id: 'user-1',
      username: 'tech_guru',
      displayName: 'Tech Guru',
      email: 'guru@tech.com',
      bio: 'Building the future of the web. 🚀 #React #Web3',
      location: 'San Francisco, CA',
      website: 'techguru.dev',
      joinDate: '2022-01-15',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
      coverImage: 'https://picsum.photos/seed/tech/1500/500',
      followersCount: 12500,
      followingCount: 450,
      tweetsCount: 1200,
      isVerified: true
    },
    {
      id: 'user-2',
      username: 'design_queen',
      displayName: 'Design Queen',
      email: 'queen@design.com',
      bio: 'Pixel perfect designs and aesthetic vibes. ✨',
      location: 'Paris, France',
      website: 'designqueen.studio',
      joinDate: '2021-05-20',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
      coverImage: 'https://picsum.photos/seed/design/1500/500',
      followersCount: 8900,
      followingCount: 320,
      tweetsCount: 850,
      isVerified: true
    }
  ]
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
    const { email, username } = req.body;
    
    // Check if user already exists
    if (db.users.find((u: any) => u.email === email || u.username === username)) {
      return res.status(400).json({ error: "L'utilisateur existe déjà" });
    }

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
    console.log(`New user signed up: ${newUser.username}`);
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
