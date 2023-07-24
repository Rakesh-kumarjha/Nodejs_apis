import User from "../models/users.js";

export const getAlldata = async (req, res, next) => {
  const id = req.query.id;
  console.log(id);
  try {
    const Result = await User.findAll({
      attributes: ["name", "emailid", "password", "usertype"],
      raw: true,
    });
    res.status(200).json({
      message: `Alldata is inserted `,
      Result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
