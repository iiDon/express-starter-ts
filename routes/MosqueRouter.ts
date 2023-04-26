import { Router } from "express";
const route = Router();
import {
  createMosque,
  deleteMosque,
  getAllMosque,
  getMosque,
  updateMosque,
} from "../controllers/MosqueController";

route.get("/", getAllMosque);
route.get("/:id", getMosque);
route.post("/", createMosque);
route.put("/:id", updateMosque);
route.delete("/:id", deleteMosque);

export default route;
