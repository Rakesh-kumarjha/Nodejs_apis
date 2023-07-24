import jwt from "jsonwebtoken"; // Import the jwt module

import Cryptr from "cryptr";
const cryptr = new Cryptr("myTotallySecretKey");
import User from "../models/users.js";
import { validationErrorHandler } from "../helpers/validation-error-handler.js";

export const logIn = async (req, res, next) => {
  validationErrorHandler(req, next);

  const { emailid, password } = req.body;
  console.log(req.body);

  try {
    const data = await User.findOne({
      where: {
        emailid: emailid,
      },
    });

    if (!data) {
      const error = new Error(`${emailid} your Account not found!`);
      error.statusCode = 404;
      return next(error);
    }

    const decryptedString = cryptr.decrypt(data.password);
    if (decryptedString !== password) {
      const error = new Error(
        `${emailid} Wrong Password please check your password`
      );
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      { emailid: data.emailid, usertype: data.usertype },
      "yourSecretPrivateKey" // Replace "yourSecretPrivateKey" with your actual secret key for signing the JWT
    );

    // Store the token in the user model's token field
    data.token = token;
    await data.save();

    const usertype = data["usertype"];

    res.status(200).json({
      message: `${emailid} logged in successfully as ${usertype}`,
      usertype: usertype,
      token: token,
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
