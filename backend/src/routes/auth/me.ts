import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function me(req: Request, res: Response) {
  try {
    const token = req.headers.authorization;
    if (!token)
      return res.status(401).send({ message: "Not logged in", path: "login" });

    // Verify the token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (e) {
      return res.status(401).send({ message: "Invalid token", path: "login" });
    }
    if (!decoded || !decoded.userId)
      return res.status(401).send({ message: "Invalid token", path: "login" });

    // Send the user data
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        email: true,
        name: true,
        verified: true,
        role: true,
      },
    });
    if (!user)
      return res.status(401).send({ message: "User not found", path: "login" });
    return res.status(200).send({
      data: user,
    });
  } catch (e) {
    return res.status(500).send({ message: "Internal server error" });
  }
}
