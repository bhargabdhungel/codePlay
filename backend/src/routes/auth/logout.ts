import { Request, Response } from "express";
export default async function logout(req : Request, res : Response) {
  res.clearCookie("token");
  return res.status(200).send({ message: "Logged out" });
}