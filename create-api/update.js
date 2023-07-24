import User from "../models/users.js";
import { validationErrorHandler } from "../helpers/validation-error-handler.js";

export const updateContact = async (req, res, next) => {
    try {
      validationErrorHandler(req, next);
  
      const {name} = req.params;
      const { emailid, password, usertype,} = req.body;
  
      if (!name) {
        const error = new Error("Email is required");
        error.statusCode = 400;
        throw error;
      }
  
      const [result] = await User.update(
        {
            name,emailid,password,usertype,
          
        },
        {
          where: {
            name,
          },
        }
      );
  
      if (result === 0) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
  
      res.status(200).json({
        message: "User updated successfully",
      });
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        err.statusCode = 400;
      } else if (!err.statusCode) {
        err.statusCode = 500;
      }
  
      console.error(err);
      next(err);
    }
  };