// import { Request, Response, NextFunction } from "express";
// import prisma from "../prisma/client";

// const getAllCategory = async (req: Request, res: Response) => {
//   if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
//     return res.status(401).json({ Error: "Sorry you are not admin" });

//   const Category = await prisma.pointCategory.findMany({
//     where: { mosqueId: res.locals.user.mosqueId },
//   });

//   if (!Category) return res.status(404).json({ Error: "Category not found" });

//   res.status(200).json(Category);
// };

// const getCategory = async (req: Request, res: Response) => {
//   if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
//     return res.status(401).json({ Error: "Sorry you are not admin " });

//   const Category = await prisma.pointCategory.findFirst({
//     where: {
//       AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
//     },
//   });

//   if (!Category) return res.status(404).json({ Error: "Category not found" });

//   res.status(200).json(Category);
// };

// const createCategory = async (req: Request, res: Response) => {
//   const { name, value } = req.body as {
//     name: string;
//     value: number;
//   };

//   if (!name || !value)
//     return res.status(400).json({ Error: "Please enter name and value" });

//   if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
//     return res.status(401).json({ Error: "Sorry you are not admin" });

//   const Category = await prisma.pointCategory.create({
//     data: {
//       mosqueId: res.locals.user.mosqueId,
//       name,
//       value,
//     },
//   });

//   res.status(200).json(Category);
// };

// const updateCategory = async (req: Request, res: Response) => {
//   const { name, value } = req.body as {
//     name?: string;
//     value?: number;
//   };

//   if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
//     return res.status(401).json({ Error: "Sorry you are not admin" });

//   if (!name && !value)
//     return res.status(400).json({ Error: "Please enter name or value" });

//   const cateExist = await prisma.pointCategory.findFirst({
//     where: {
//       AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
//     },
//   });

//   if (!cateExist) return res.status(404).json({ Error: "No cateExist " });

//   const cate = await prisma.pointCategory.update({
//     where: { id: cateExist.id },
//     data: {
//       name: name || cateExist.name,
//       value: value || cateExist.value,
//     },
//   });

//   res.status(200).json(cate);
// };

// const deleteCategory = async (req: Request, res: Response) => {
//   if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
//     return res.status(401).json({ Error: "Sorry you are not admin" });

//   const pointCategoryExist = await prisma.pointCategory.findFirst({
//     where: {
//       AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
//     },
//   });

//   console.log(pointCategoryExist);

//   if (!pointCategoryExist)
//     return res.status(404).json({ Error: "pointCategory not found" });

//   const pointCategory = await prisma.pointCategory.delete({
//     where: { id: pointCategoryExist.id },
//   });

//   res.status(200).json(pointCategory);
// };

// export {
//   getAllCategory,
//   getCategory,
//   updateCategory,
//   deleteCategory,
//   createCategory,
// };
