import { Router } from "express";
const route = Router();
import {
  getSettings,
  updateProduct
} from "../controllers/SettingsController";

route.get("/", getSettings);
route.put("/", updateProduct);


export default route;

