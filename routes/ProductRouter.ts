import { Router } from "express";
const route = Router();
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/ProductController";

route.get("/", getAllProduct);
route.get("/:id", getProduct);
route.post("/", createProduct);
route.put("/:id", updateProduct);
route.delete("/:id", deleteProduct);

export default route;
