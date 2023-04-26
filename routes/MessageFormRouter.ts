import { Router } from "express";
const route = Router();
import {
  createMessageForm,
  deleteMessageForm,
  getAllMessageForm,
  getMessageForm,
  updateMessageForm,
} from "../controllers/MessageFormController";

route.get("/", getAllMessageForm);
route.get("/:id", getMessageForm);
route.post("/", createMessageForm);
route.put("/:id", updateMessageForm);
route.delete("/:id", deleteMessageForm);

export default route;
