import { Router } from "express";
const route = Router();
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudent,
  updateStudent,
} from "../controllers/StudentController";

route.get("/", getAllStudents);
route.get("/:id", getStudent);
route.post("/", createStudent);
route.put("/:id", updateStudent);
route.delete("/:id", deleteStudent);

export default route;
