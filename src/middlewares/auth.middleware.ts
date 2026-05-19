import { NextFunction, Request, Response } from "express";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";


export default (req: Request, res: Response, next: NextFunction) => {
  const authorizaton = req.headers.authorization;

  if (!authorizaton) {
    return response.unauthorized(res);
  }

  const [prefix, token ] = authorizaton.split(" ");

  if (!(prefix === 'Bearer' && token)) {
    return response.unauthorized(res);
  }

  const user = getUserData(token);

  if (!user) {
    return response.unauthorized(res);
  }

  (req as IReqUser).user = user;

  next();
}