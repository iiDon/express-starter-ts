import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import prisma from "../prisma/client";

//  register
const register = async (req: Request, res: Response) => {
  const { email, password } = (await req.body) as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    return res.status(401).json({ Error: "Sorry you have missing fields" });
  }

  const emailUsed = await prisma.user.findUnique({ where: { email } });

  if (emailUsed)
    return res.status(401).json({ Error: "Sorry this mail is used " });

  const hashedPassword = await bycrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      mosqueId: "clefu4brr0000v9mor274gns5",
    },
  });

  res.status(201).json("You have sucessfuly registered");
};

// login
const login = async (req: Request, res: Response) => {
  const { email, password } = (await req.body) as {
    email: string;
    password: string;
  };

  if (!email || !password)
    return res.status(401).json({ Error: "Sorry you have missing fields" });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res
      .status(401)
      .json({ error: "Sorry, Email or Password is not correct" });
  }

  const isValid = await bycrypt.compare(password, user.password);

  if (!isValid) {
    return res
      .status(401)
      .json({ error: "Sorry, Email or Password is not correct" });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      //   role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  return res
    .cookie("access_token", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged in successfully 😊 👌" });
};

export { register, login };
