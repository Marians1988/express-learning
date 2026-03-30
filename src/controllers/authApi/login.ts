import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user.js";
import { HttpStatusCode } from "axios";
import bcrypt from "bcryptjs";
import { AppError } from "../../errorHandling/errorClass.js";
import { validationResult } from "express-validator";

export default async (req: Request, res: Response,next: NextFunction)=> {
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          throw new AppError(errors.array().map(err => `${err.type}: ${err.msg}`).join(', '), HttpStatusCode.BadRequest);
      }   
      return res
      .setHeader('Set-Cookie','loggedIn=true; Max-Age=10; httpOnly')
      .status(HttpStatusCode.Accepted)
      .json({ message: "Correct Password" });
      
    } catch (err) {
      next(err);
    }
}

 



