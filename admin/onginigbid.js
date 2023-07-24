import User from "../models/users.js";
import Bid from "../models/bid.js";
import BidRequest from "../models/bidrequest.js";
import jwt from "jsonwebtoken";

export const requestBid = async (req, res, next) => {
  const { amount } = req.body;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "yourSecretPrivateKey");
    const emailid = decodedToken.emailid;

    const user = await User.findOne({ where: { emailid: emailid } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activeBid = await BidRequest.findOne({
      where: { bidstatus: "start" },
    });

    if (!activeBid) {
      return res.status(400).json({ message: "No active bid available" });
    }

    const existingRequest = await BidRequest.findOne({
      where: { emailid: emailid, bidstatus: "start" },
    });

    if (existingRequest) {
      // Check if bid is created after the bid request
      const latestBid = await Bid.findOne({
        where: { UserId: user.id },
        order: [["createdAt", "DESC"]],
      });

      if (!latestBid) {
        return res.status(404).json({ message: "No bid found" });
      }

      if (latestBid.createdAt <= existingRequest.createdAt) {
        return res
          .status(400)
          .json({ message: "You have already sent a bid request" });
      }

      // Store the latestBid's BidId in the BidRequest table
      existingRequest.BidId = latestBid.id;
      await existingRequest.save();

      res.status(200).json({
        message: "Bid request created successfully",
        bidRequest: existingRequest,
      });
    } else {
      const latestBid = await Bid.findOne({
        where: { UserId: user.id },
        order: [["createdAt", "DESC"]],
      });

      if (!latestBid) {
        return res.status(404).json({ message: "No bid found" });
      }

      const bidRequest = await BidRequest.create({
        amount: amount,
        BidId: latestBid.id,
        emailid: emailid,
      });

      res.status(200).json({
        message: "Bid request created successfully",
        bidRequest: bidRequest,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
