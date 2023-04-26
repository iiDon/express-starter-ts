import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

const getAllHalaqah = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const halaqah = await prisma.halaqah.findMany({
    where: { mosqueId: res.locals.user.mosqueId },
  });

  res.status(200).json(halaqah);
};

const getHalaqah = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin " });

  const halaqah = await prisma.halaqah.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!halaqah) return res.status(404).json({ Error: "Halaqah not found" });

  res.status(200).json(halaqah);
};

const createHalaqah = async (req: Request, res: Response) => {
  const { halqahName } = req.body as { halqahName: string };

  if (!halqahName)
    return res.status(400).json({ Error: "Please enter halqah name" });

  if (res.locals.user.role !== "ADMIN")
    return res.status(401).json({ Error: "Sorry you are not admin" });

  if (!res.locals.user.mosqueId)
    return res.status(404).json({ Error: "Mosque not found" });

  const halaqah = await prisma.halaqah.create({
    data: {
      mosqueId: res.locals.user.mosqueId,
      name: halqahName,
    },
  });

  res.status(200).json(halaqah);
};

const updateHalaqah = async (req: Request, res: Response) => {
  const { name } = req.body as { name?: string };

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  if (!name) return res.status(400).json({ Error: "Please enter halqah name" });

  const HalaqahIdExist = await prisma.halaqah.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!HalaqahIdExist)
    return res.status(404).json({ Error: "لا يوجد حلقة بهذا الرقم" });

  const halaqah = await prisma.halaqah.update({
    where: { id: HalaqahIdExist.id },
    data: {
      name: name || HalaqahIdExist.name,
    },
  });

  res.status(200).json(halaqah);
};

const deleteHalaqah = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const halaqahIdExist = await prisma.halaqah.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!halaqahIdExist)
    return res.status(404).json({ Error: "Halqah not found" });

  const halaqah = await prisma.halaqah.delete({
    where: { id: halaqahIdExist.id },
  });

  res.status(200).json(halaqah);
};

export {
  getAllHalaqah,
  getHalaqah,
  createHalaqah,
  updateHalaqah,
  deleteHalaqah,
};
