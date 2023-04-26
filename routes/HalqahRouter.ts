import { Router } from "express";
const route = Router();
import {
createHalaqah,
deleteHalaqah,
getAllHalaqah,
getHalaqah,
updateHalaqah,

} from "../controllers/HalqahController";

route.get("/", getAllHalaqah);
route.get("/:id", getHalaqah);
route.post("/", createHalaqah);
route.put("/:id", updateHalaqah);
route.delete("/:id", deleteHalaqah);

export default route;
