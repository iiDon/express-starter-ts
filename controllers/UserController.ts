import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

const getAllUsers = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN")
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
    },
  });

  res.status(200).json(users);
};

const me = async (req: Request, res: Response) => {
  const id: string = await res.locals.user.userId;

  if (!id) return res.status(404).json({ Error: "User Id not found" });

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) return res.status(404).json({ Error: "User not found" });

  res.status(200).json(user);
};

export { getAllUsers, me };
