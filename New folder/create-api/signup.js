import Cryptr from "cryptr";
import { createRequire } from "module";
import User from "../models/users.js";
import { validationErrorHandler } from "../helpers/validation-error-handler.js";

const cryptr = new Cryptr("myTotallySecretKey");
const require = createRequire(import.meta.url);

export const signUp = async (req, res, next) => {
  try {
    validationErrorHandler(req, next);

    const { name, emailid, password,phone, usertype } = req.body;

    // Check if the user already exists based on emailid
    const existingUser = await User.findOne({ where: { emailid } });

    if (existingUser) {
      const error = new Error("This Email already exists: " + emailid);
      error.statusCode = 403;
      throw error;
    }

    const encryptedPassword = cryptr.encrypt(password);
    const data = await User.create({
      name,
      emailid,
      phone,
      usertype,
      isActive: false,
      password: encryptedPassword,
    });

    res.status(200).json({
      message: `${emailid} you registered successfully`,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
