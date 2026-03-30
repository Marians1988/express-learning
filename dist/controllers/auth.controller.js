import { User } from "../models/user.js";
import { HttpStatusCode } from "axios";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
export async function postSignUp(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.
                status(HttpStatusCode.BadRequest)
                .json({ errors: errors.array() });
        }
        const userExists = await checkUserAlreadyExist(req);
        if (userExists) {
            return res
                .status(HttpStatusCode.BadRequest)
                .json({ code: "10000-10001", message: "user already existing" });
        }
        const password = await encodePassword(req);
        if (!password) {
            return res
                .status(HttpStatusCode.InternalServerError)
                .json({ error: "error during encode password" });
        }
        await addNewUser(req, password);
        return res
            .status(HttpStatusCode.Accepted)
            .json({ message: "User saved!" });
    }
    catch (err) {
        console.error("Unexpected error:", err);
        return res
            .status(HttpStatusCode.InternalServerError)
            .json({ error: "Unexpected server error" });
    }
}
export async function postLogin(req, res, next) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(HttpStatusCode.BadRequest)
                .json({ code: "10000-10001", message: "user already existing" });
        }
        else {
            const doMatch = await bcrypt.compare(password, user.password);
            if (!doMatch) {
                return res
                    .status(HttpStatusCode.Unauthorized)
                    .json({ code: "10000-10003", message: "passeword is not correct" });
            }
            else {
                return res
                    .setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10; httpOnly')
                    .status(HttpStatusCode.Accepted)
                    .json({ message: "Correct Password" });
            }
        }
    }
    catch (err) {
        console.error("Unexpected error:", err);
        return res
            .status(HttpStatusCode.InternalServerError)
            .json({ error: "Unexpected server error" });
    }
}
async function checkUserAlreadyExist(req) {
    const email = req.body.email;
    const user = await User.findOne({ email });
    return user !== null; // true se esiste
}
async function encodePassword(req) {
    const password = req.body.password;
    return bcrypt.hash(password, 12);
}
async function addNewUser(req, password) {
    const email = req.body.email;
    const newUser = new User({
        email: email,
        password: password
    });
    return newUser.save();
}
