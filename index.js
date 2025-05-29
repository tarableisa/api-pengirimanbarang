import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./routes/Route.js";
import "./model/Associations.js";
import SequelizeStore from "connect-session-sequelize";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5000",
  credentials: true,
}));

app.use(express.json());

// Session
const SequelizeSessionStore = SequelizeStore(session.Store);
const store = new SequelizeSessionStore({ db });

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store, // 👈 tambahkan ini
  cookie: {
    maxAge: 3600000, // 1 jam
  },
}));

// Sinkronisasi tabel session
store.sync();

app.use(router);

try {
  await db.authenticate();
  await db.sync({ alter: true }); // <- ini yang ditambahkan
  console.log("Database connected and synced (with alter)");
} catch (error) {
  console.error("DB connection failed:", error);
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
