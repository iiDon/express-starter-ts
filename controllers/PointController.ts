import { Request, Response } from "express";
import prisma from "../prisma/client";

const getAllPoint = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const point = await prisma.point.findMany({
    where: { Student: { mosqueId: res.locals.user.mosqueId } },
  });

  if (!point) return res.status(404).json({ Error: "point not found" });

  res.status(200).json(point);
};

const getPoint = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin " });

  const point = await prisma.point.findFirst({
    where: {
      AND: [
        { id: req.params.id },
        { Student: { mosqueId: res.locals.user.mosqueId } },
      ],
    },
    include: {
      PointCategory: true,
      Student: true,
    },
  });

  if (!point) return res.status(404).json({ Error: "point not found" });

  res.status(200).json(point);
};

const createPointByCate = async (req: Request, res: Response) => {
  const { categoryId, studentId, note } = req.body as {
    categoryId: string;
    studentId: string;
    note?: string;
  };

  if (!categoryId || !studentId)
    return res.status(400).json({ Error: "Please enter student and cate" });

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const pointCategoryExist = await prisma.pointCategory.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId, id: categoryId }],
    },
  });

  if (!pointCategoryExist)
    return res.status(404).json({ Error: "No pointCategory " });

  const studentExist = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!studentExist) return res.status(404).json({ Error: "No student " });

  await prisma.point.create({
    data: {
      studentId,
      note: note || null,
    },
  });

  const addPoint = await prisma.student.update({
    where: { id: studentId },
    data: {
      point: {
        increment: pointCategoryExist.value,
      },
    },
  });

  res.status(200).json(addPoint);
};

// const updatePoint = async (req: Request, res: Response) => {
//   const { name, value } = req.body as { name?: string; value?: number };

//   if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
//     return res.status(401).json({ Error: "Sorry you are not admin" });

//   if (!name && !value)
//     return res.status(400).json({ Error: "Please enter name or value" });

//   const pointExist = await prisma.pointCategory.findFirst({
//     where: {
//       AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
//     },
//   });

//   if (!pointCategoryExist)
//     return res.status(404).json({ Error: "No pointCategory " });

//   const pointCategory = await prisma.pointCategory.update({
//     where: { id: pointCategoryExist.id },
//     data: {
//       name: name || pointCategoryExist.name,
//       value: value || pointCategoryExist.value,
//     },
//   });

//   res.status(200).json(pointCategory);
// };

const deletePoint = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  const pointExist = await prisma.point.findFirst({
    where: {
      AND: [
        { id: req.params.id },
        { Student: { mosqueId: res.locals.user.mosqueId } },
      ],
    },
  });

  if (!pointExist)
    return res.status(404).json({ Error: "pointExist not found" });

  const point = await prisma.point.delete({
    where: { id: pointExist.id },
    include: {
      Student: {
        include: {
          Mosque: true,
          Halaqah: true,
          Point: true,
        },
      },
      PointCategory: true,
    },
  });

  const studentPoint = await prisma.student.findUnique({
    where: { id: point?.Student.id },
    select: { point: true },
  });

  await prisma.student.update({
    where: { id: point?.Student.id },
    data: {
      point: {
        decrement: point?.PointCategory.value,
      },
    },
  });

  const studentPointAfter = await prisma.student.findUnique({
    where: { id: point?.Student.id },
    select: { point: true },
  });

  res.status(200).json({
    name: point?.Student.name,
    mosque: point?.Student.Mosque?.name,
    halqah: point?.Student.Halaqah?.name,
    PointBeforeDelete: studentPoint?.point,
    PointDeleted: point?.PointCategory.value,
    PointAfterDelete: studentPointAfter?.point,
  });
};

export {
  getAllPoint,
  getPoint,
  createPointByCate,
  // updatePoint,
  deletePoint,
};
