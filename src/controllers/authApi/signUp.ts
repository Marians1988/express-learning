import {NextFunction, Request, Response } from "express";
import { User } from "../../models/user.js";
import { HttpStatusCode } from "axios";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { AppError } from "../../errorHandling/errorClass.js";

export default async (req: Request, res: Response ,next: NextFunction)=> {
    const {email, password} = req?.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new AppError(errors.array().map(err => `${err.type}: ${err.msg}`).join(', '), HttpStatusCode.BadRequest);
        }
     
        const passwordDecoded= await bcrypt.hash(password, 12);
        if (!password) {
            throw new AppError('error during encode password', HttpStatusCode.BadRequest);
        }

        await addNewUser(email, passwordDecoded);

        return res
            .status(HttpStatusCode.Accepted)
            .json({ message: "User saved!" });

    } catch (err) {
        next(err);
    }
}

async function addNewUser(email: string, password: string) {
  const newUser = new User({
    email: email,
    password: password
  });

  return newUser.save();
}