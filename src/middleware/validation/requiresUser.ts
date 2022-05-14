import { get } from "lodash";
import { Request, Response, NextFunction } from "express";

const requiresUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "user");

  if (!user) {
    return res.sendStatus(403);

    // return res.status(403).json({ 
    //   status: 40,
    //   message: "User does not exist"
    // });
  }

  return next();
};

export default requiresUser;
