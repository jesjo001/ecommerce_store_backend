import config from "config";
import { get } from "lodash";
import {
  validatePassword,
  validateWithUsername,
} from "../service/users/createUser";
import { Request, Response } from "express";
import { LeanDocument, FilterQuery, UpdateQuery } from "mongoose";
import {
  createAccessToken,
  createSession,
  updateSession,
  findSessions,
} from "../service/session/session.service";
import { UserDocument } from "../model/user.model";
import { SessionDocument } from "../model/session.model";
import { sign } from "../utils/jwt.utils";
import log from "../logger";

export async function createUserSessionHandler(req: Request, res: Response) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: 400,
      message: "username or password are required to login",
    });
  }

  // validate the email and password
  const user = await validateWithUsername(req.body);

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  // Create a sessions
  const session = await createSession(
    user._id as any,
    req.get("user-agent") || ""
  );

  // create access token
  const accessToken = createAccessToken({
    user,
    session,
  });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: process.env.refreshTokenTtl as any,
    // expiresIn: config.get("refreshTokenTtl"),
  });

  // send refresh & access token back
  return res.send({ accessToken, refreshToken });
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");

  log.info(sessionId);

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}
