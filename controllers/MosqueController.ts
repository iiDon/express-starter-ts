import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

const getAllMosque = async (req: Request, res: Response) => {
  const id: string = req.body.userId;

  if (res.locals.user.role !== "ADMIN")
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const mosques = await prisma.mosque.findMany();

  res.status(200).json(mosques);
};

const getMosque = async (req: Request, res: Response) => {
  if (
    res.locals.user.role !== "ADMIN" &&
    res.locals.user.mosqueId !== req.params.id
  )
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const mosque = await prisma.mosque.findUnique({
    where: { id: res.locals.user.mosqueId },
  });

  res.status(200).json(mosque);
};

const createMosque = async (req: Request, res: Response) => {
  const { name } = req.body as { name: string };

  if (!name)
    return res.status(401).json({ Error: "Sorry you have missing fields" });

  if (res.locals.user.role !== "ADMIN")
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const mosque = await prisma.mosque.create({ data: { name } });

  res.status(200).json(mosque);
};

const updateMosque = async (req: Request, res: Response) => {
  const { name, address } = req.body as {
    name?: string;
    address?: string;
  };

  if (
    res.locals.user.role !== "ADMIN" &&
    res.locals.user.mosqueId !== req.params.id
  )
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const mosqueExist = await prisma.mosque.findUnique({
    where: { id: res.locals.user.mosqueId },
  });

  if (!mosqueExist) return res.status(404).json({ Error: "Mosque not found" });

  const mosque = await prisma.mosque.update({
    where: { id: res.locals.user.mosqueId },
    data: {
      name: name || mosqueExist.name,
      address: address || mosqueExist.address,
    },
  });

  res.status(200).json(mosque);
};

const deleteMosque = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN")
    return res.status(401).json({ Error: "Sorry you are not admin" });

  // const mosqueExist = await prisma.mosque.findUnique({
  //   where: { id: req.params.id },
  // });

  // if (!mosqueExist) return res.status(404).json({ Error: "Mosque not found" });
  // // remove any relation with mosque
  // await prisma.user.updateMany({
  //   where: { mosqueId: req.params.id },
  //   data: { mosqueId: null },
  // });

  // await prisma.halaqah.updateMany({
  //   where: { mosqueId: req.params.id },
  //   data: { mosqueId: null },
  // });

  // const mosque = await prisma.mosque.delete({
  //   where: { id: mosqueExist.id },
  // });

  res.status(200).json("Mosque deleted");
};

export { getAllMosque, getMosque, createMosque, updateMosque, deleteMosque };
