import { Router } from "express";
const route = Router();
import {
  getAllPoint,
  getPoint,
  createPointByCate,
  deletePoint,
  // updatePoint,
} from "../controllers/PointController";

route.get("/", getAllPoint);
route.get("/:id", getPoint);
route.post("/", createPointByCate);
// route.put("/:id", updatePoint);
route.delete("/:id", deletePoint);

export default route;
