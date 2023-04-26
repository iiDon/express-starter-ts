import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

const getAllMessageForm = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const messageForm = await prisma.messageForm.findMany({
    where: { mosqueId: res.locals.user.mosqueId },
  });

  if (!messageForm)
    return res.status(404).json({ Error: "messageForm not found" });

  res.status(200).json(messageForm);
};

const getMessageForm = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin " });

  const messageForm = await prisma.messageForm.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!messageForm)
    return res.status(404).json({ Error: "messageForm not found" });

  res.status(200).json(messageForm);
};

const createMessageForm = async (req: Request, res: Response) => {
  const { title, message } = req.body as {
    title: string;
    message: string;
  };

  if (!title || !message)
    return res.status(400).json({ Error: "Please enter title and message" });

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const messageForm = await prisma.messageForm.create({
    data: {
      mosqueId: res.locals.user.mosqueId,
      title,
      message,
    },
  });

  res.status(200).json(messageForm);
};

const updateMessageForm = async (req: Request, res: Response) => {
  const { title, message } = req.body as {
    title?: string;
    message?: string;
  };

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  if (!title && !message)
    return res.status(400).json({ Error: "Please enter title or message" });

  const messageFormExist = await prisma.messageForm.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!messageFormExist)
    return res.status(404).json({ Error: "No messageFormExist " });

  const messageForm = await prisma.messageForm.update({
    where: { id: messageFormExist.id },
    data: {
      title: title || messageFormExist.title,
      message: message || messageFormExist.message,
    },
  });

  res.status(200).json(messageForm);
};

const deleteMessageForm = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const messageFormExist = await prisma.messageForm.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!messageFormExist)
    return res.status(404).json({ Error: "Product not found" });

  const messageForm = await prisma.messageForm.delete({
    where: { id: messageFormExist.id },
  });

  res.status(200).json(messageForm);
};

export {
  getAllMessageForm,
  getMessageForm,
  createMessageForm,
  updateMessageForm,
  deleteMessageForm,
};
