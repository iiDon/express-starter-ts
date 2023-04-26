import { Attendance } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

const getAllAttendace = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query as {
    startDate: string;
    endDate: string;
  };

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({
      Error: "Sorry you are not admin or you don't enrolled to any mosque",
    });

  const halqah = await prisma.halaqah.findMany({
    where: {
      mosqueId: res.locals.user.mosqueId,
    },
  });

  let attend: Attendance[][] = [];

  halqah.forEach(async (halqat) => {
    const attendace = await prisma.attendance.findMany({
      where: {
        halaqahId: halqat.id,
        date: {
          gte: startDate || undefined,
          lte: endDate || undefined,
        },
      },
      include: {
        Halaqah: true,
        Student: true,
      },
    });

    if (attendace.length > 0) attend.push(attendace);

    if (attend.length === halqah.length) res.status(200).json(attend);
  });
};

const getAttendace = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({
      Error: "Sorry you are not admin or you don't enrolled to any mosque",
    });

  const attend = await prisma.attendance.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      Student: true,
    },
  });

  if (!attend || attend.Student?.mosqueId !== res.locals.user.mosqueId)
    return res.status(404).json({ Error: "Attend not found" });

  res.status(200).json(attend);
};

const createAttendace = async (req: Request, res: Response) => {
  const { RFID } = req.body as { RFID: string };

  if (!RFID)
    return res.status(401).json({ Error: "Sorry you have missing fields" });

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const student = await prisma.student.findUnique({
    where: { RFID },
    select: { id: true, mosqueId: true, halaqahId: true },
  });

  if (!student || student.mosqueId !== res.locals.user.mosqueId)
    return res.status(404).json({ Error: "RFID not found" });

  if (!student?.halaqahId)
    return res.status(404).json({ Error: "No halqah for the student" });
  console.log(new Date(new Date().setHours(0, 0, 0, 0)));
  const CheckAttendace = await prisma.attendance.findFirst({
    where: {
      Student: {
        mosqueId: res.locals.user.mosqueId,
        RFID,
      },
      date: {
        lte: new Date(),
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  if (CheckAttendace)
    return res.status(404).json({ Error: "You already attended today" });

  const attendace = await prisma.attendance.create({
    data: {
      Student: { connect: { id: student.id } },
      Halaqah: { connect: { id: student.halaqahId } },
    },
  });

  // auto add point for attendace
  const point = await prisma.point.create({
    data: {
      Student: { connect: { id: student.id } },
      PointCategory: { connect: { id: "1" } },
    },
  });

  res.status(201).json(attendace);
};

const updateAttendace = async (req: Request, res: Response) => {
  const { attendId, newDate } = req.body as {
    attendId: string;
    newDate: Date;
  };

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  if (!isFinite(+new Date(newDate)) || !isNaN(+newDate))
    return res.status(401).json({ Error: "Sorry you have invalid date" });

  if (!attendId || !newDate)
    return res.status(401).json({ Error: "Sorry you have missing fields" });

  const attendanceExist = await prisma.attendance.findUnique({
    where: { id: attendId },
    select: { Student: { select: { mosqueId: true } }, id: true },
  });

  if (
    !attendanceExist ||
    attendanceExist.Student?.mosqueId !== res.locals.user.mosqueId
  )
    return res.status(404).json({ Error: "Student not found" });

  const attend = await prisma.attendance.update({
    where: { id: attendId },
    data: {
      date: newDate,
    },
  });

  res.status(200).json(attend);
};

const deleteAttendace = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const attendanceExist = await prisma.attendance.findUnique({
    where: { id: req.params.id },
    select: { Student: { select: { mosqueId: true } }, id: true },
  });

  if (
    !attendanceExist ||
    attendanceExist.Student?.mosqueId !== res.locals.user.mosqueId
  )
    return res.status(404).json({ Error: "Attend not found" });

  const attendance = await prisma.attendance.delete({
    where: { id: attendanceExist.id },
  });

  res.status(200).json(attendance);
};

export {
  getAllAttendace,
  getAttendace,
  createAttendace,
  updateAttendace,
  deleteAttendace,
};
