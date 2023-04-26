import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

const getSettings = async (req: Request, res: Response) => {
  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin " });

  const Settings = await prisma.settings.findFirst({
    where: { mosqueId: res.locals.user.mosqueId },
  });

  if (!Settings) {
    const newSettings = await prisma.settings.create({
      data: {
        mosqueId: res.locals.user.mosqueId,
        name: "",
        attendTime: "",
        attendTimeEnd: "",
        usernameSMS: "",
        passwordSMS: "",
      },
    });

    return res.status(200).json(newSettings);
  }

  res.status(200).json(Settings);
};

const updateProduct = async (req: Request, res: Response) => {
  const { name, attendTime, attendTimeEnd, usernameSMS, passwordSMS } =
    req.body as {
      name?: string;
      attendTime?: string;
      attendTimeEnd?: string;
      usernameSMS?: string;
      passwordSMS?: string;
    };

  if (res.locals.user.role !== "ADMIN" && !res.locals.user.mosqueId)
    return res.status(401).json({ Error: "Sorry you are not admin" });

  if (!name && !attendTime && !attendTimeEnd && !usernameSMS && !passwordSMS)
    return res.status(400).json({ Error: "Please enter data" });

  const SettingsExist = await prisma.settings.findFirst({
    where: {
      AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
    },
  });

  if (!SettingsExist)
    return res.status(404).json({ Error: "No SettingsExist " });

  const Settings = await prisma.settings.update({
    where: { id: SettingsExist.id },
    data: {
      name: name || SettingsExist.name,
      attendTime: attendTime || SettingsExist.attendTime,
      attendTimeEnd: attendTimeEnd || SettingsExist.attendTimeEnd,
      usernameSMS: usernameSMS || SettingsExist.usernameSMS,
      passwordSMS: passwordSMS || SettingsExist.passwordSMS,
    },
  });

  res.status(200).json(Settings);
};

export { getSettings, updateProduct };
