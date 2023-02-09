import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// import routers
import UserRouter from "./routes/UserRouter";
import AuthRouter from "./routes/AuthRouter";

// config
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Middleware
import isAuthed from "./middleware/isAuthed";

if (!process.env.PORT) {
  process.exit(1);
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(cookieParser());
app.use("/api/", AuthRouter);
app.use("/api/users", isAuthed , UserRouter);
