import { get } from "lodash";
import { Request, Response, NextFunction } from "express";

const requiresAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "user");

  if (!user) {
    return res.status(403).json({ 
      status: 403,
      message: "User not found. Kindly log in",
    });
  }

  if (String(user.role) !== "admin") return res.status(401).json({ 
      status:401,
      message: "User not authorized"
    });            

  return next();
};

export default requiresAdmin;
