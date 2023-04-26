import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// import routers
import UserRouter from "./routes/UserRouter";
import AuthRouter from "./routes/AuthRouter";
import MosqueRouter from "./routes/MosqueRouter";
import HalqahRouter from "./routes/HalqahRouter";
import StudentRouter from "./routes/StudentRouter";
import AttendanceRouter from "./routes/AttendanceRouter";
// import PointCategoryRouter from "./routes/PointCategoryRouter";
import ProductRouter from "./routes/ProductRouter";
import MessageFormRouter from "./routes/MessageFormRouter";
import PointRouter from "./routes/PointRouter";

// config
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Middleware
import isAuthed from "./middleware/isAuthed";

if (!process.env.PORT) {
  process.exit(1);
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use("/api/", AuthRouter);
app.use("/api/users", isAuthed, UserRouter);
app.use("/api/mosques", isAuthed, MosqueRouter);
app.use("/api/halqah", isAuthed, HalqahRouter);
app.use("/api/student", isAuthed, StudentRouter);
app.use("/api/attendance", isAuthed, AttendanceRouter);
// app.use("/api/point-category", isAuthed, PointCategoryRouter);
app.use("/api/point", isAuthed, PointRouter);
app.use("/api/product", isAuthed, ProductRouter);
app.use("/api/message-form", isAuthed, MessageFormRouter);
