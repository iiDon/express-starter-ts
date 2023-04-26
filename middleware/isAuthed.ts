import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import type { JwtPayload } from "jsonwebtoken";

const isAuthed = async (req: Request, res: Response, next: NextFunction) => {
  const token = await req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "You do not have access" });
  }

  try {
    const userId = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: userId.userId },
      select: {
        id: true,
        mosqueId: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    res.locals.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Request is not authorized" });
  }
};

export default isAuthed;
