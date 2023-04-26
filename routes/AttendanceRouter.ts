import { Router } from "express";
const route = Router();
import {
  createAttendace,
  getAllAttendace,
  getAttendace,
  deleteAttendace,
  updateAttendace,
} from "../controllers/AttendanceController";

route.get("/", getAllAttendace);
route.get("/:id", getAttendace);
route.post("/", createAttendace);
route.put("/:id", updateAttendace);
route.delete("/:id", deleteAttendace);

export default route;
