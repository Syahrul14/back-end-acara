import { NextFunction, Request, Response } from "express";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";


export default (req: Request, res: Response, next: NextFunction) => {
  const authorizaton = req.headers.authorization;

  if (!authorizaton) {
    return res.status(403).json({
      message: "unauthorized",
      data: null
    });
  }

  const [prefix, token ] = authorizaton.split(" ");

  if (!(prefix === 'Bearer' && token)) {
    return res.status(403).json({
      message: "unauthorized",
      data: null
    });
  }

  const user = getUserData(token);

  if (!user) {
    return res.status(403).json({
      message: "unauthorized",
      data: null
    });
  }

  (req as IReqUser).user = user;

  next();
}