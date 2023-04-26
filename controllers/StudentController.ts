import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

const getAllStudents = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({
      Error: "Sorry you are not admin or you don't enrolled to any mosque",
    });

  const students = await prisma.student.findMany({
    where: { mosqueId: res.locals.user.mosqueId },
  });

  res.status(200).json(students);
};

const getStudent = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({
      Error: "Sorry you are not admin or you don't enrolled to any mosque",
    });

  const student = await prisma.student.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!student || student.mosqueId !== res.locals.user.mosqueId)
    return res.status(404).json({ Error: "Student not found" });

  res.status(200).json(student);
};

const createStudent = async (req: Request, res: Response) => {
  const { name, phone, parentName, parentPhone, RFID, halqahId } = req.body as {
    name: string;
    phone?: string;
    parentName?: string;
    parentPhone?: string;
    RFID?: string;
    halqahId: string;
  };

  if (!name)
    return res.status(401).json({ Error: "Sorry you have missing fields" });

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const halqahExist = await prisma.halaqah.findUnique({
    where: { id: halqahId },
    select: { mosqueId: true },
  });

  if (!halqahExist || halqahExist.mosqueId !== res.locals.user.mosqueId)
    return res.status(404).json({ Error: "Halqah not found" });

  const student = await prisma.student.create({
    data: {
      name,
      phone: phone || undefined,
      parentName: parentName || undefined,
      parentPhone: parentPhone || undefined,
      RFID: RFID || undefined,
      Mosque: { connect: { id: res.locals.user.mosqueId } },
      Halaqah: { connect: { id: halqahId } },
    },
  });

  res.status(200).json(student);
};

const updateStudent = async (req: Request, res: Response) => {
  const { name, phone, parentName, parentPhone, halqahId } = req.body as {
    name?: string;
    phone?: string;
    parentName?: string;
    parentPhone?: string;
    halqahId?: string;
  };

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const studentExist = await prisma.student.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!studentExist)
    return res.status(404).json({ Error: "Student not found" });

  const halqahExist = await prisma.halaqah.findUnique({
    where: { id: halqahId },
    select: { mosqueId: true },
  });

  if (!halqahExist || halqahExist.mosqueId !== res.locals.user.mosqueId)
    return res.status(404).json({ Error: "Halqah not found" });

  const student = await prisma.student.update({
    where: { id: studentExist.id },
    data: {
      name: name || undefined,
      phone: phone || undefined,
      parentName: parentName || undefined,
      parentPhone: parentPhone || undefined,
      Halaqah: { connect: { id: halqahId || undefined } },
    },
  });

  res.status(200).json(student);
};

const deleteStudent = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const studentExist = await prisma.student.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!studentExist || studentExist.mosqueId !== res.locals.user.mosqueId)
    return res.status(404).json({ Error: "Student not found" });

  const student = await prisma.student.delete({
    where: { id: studentExist.id },
  });

  res.status(200).json(student);
};

export {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
