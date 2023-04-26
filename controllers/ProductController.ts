import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

const getAllProduct = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const product = await prisma.product.findMany({
    where: { mosqueId: res.locals.user.mosqueId },
  });

  if (!product) return res.status(404).json({ Error: "product not found" });

  res.status(200).json(product);
};

const getProduct = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin " });

  const product = await prisma.product.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!product) return res.status(404).json({ Error: "product not found" });

  res.status(200).json(product);
};

const createProduct = async (req: Request, res: Response) => {
  const { name, price, qty } = req.body as {
    name: string;
    price: number;
    qty?: number;
  };

  if (!name || !price)
    return res.status(400).json({ Error: "Please enter name and price" });

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const product = await prisma.product.create({
    data: {
      mosqueId: res.locals.user.mosqueId,
      name,
      price,
      qty: qty || undefined,
    },
  });

  res.status(200).json(product);
};

const updateProduct = async (req: Request, res: Response) => {
  const { name, price, qty } = req.body as {
    name?: string;
    price?: number;
    qty?: number;
  };

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  if (!name && !price && !qty)
    return res.status(400).json({ Error: "Please enter name or price or qty" });

  const productExist = await prisma.product.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!productExist) return res.status(404).json({ Error: "No productExist " });

  const product = await prisma.product.update({
    where: { id: productExist.id },
    data: {
      name: name || productExist.name,
      price: price || productExist.price,
      qty: qty || productExist.qty,
    },
  });

  res.status(200).json(product);
};

const deleteProduct = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const productExist = await prisma.product.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!productExist)
    return res.status(404).json({ Error: "Product not found" });

  const product = await prisma.product.delete({
    where: { id: productExist.id },
  });

  res.status(200).json(product);
};

export {
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
