import { Router } from "express";
const route = Router();
import { getAllUsers, me } from "../controllers/UserController";

route.get("/", getAllUsers);
route.get("/me", me);

export default route;