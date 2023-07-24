import User from "../models/users.js";

export const getId = async (req, res, next) => {
  let { emailid } = req.query;
  try {
    const Result = await User.findOne({
      where: {
        emailid: emailid,
      },
      attributes: ["name", "emailid", "password", "usertype"],
      raw: true,
    });
    res.status(200).json({
      Result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
