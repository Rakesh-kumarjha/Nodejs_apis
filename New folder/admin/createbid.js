import Bid from "../models/bid.js";

export const createBid = async (req, res, next) => {
  const { bidAmount, userResponse } = req.body;

  try {
    let totalBidAmount;
    let remainingBid;

    // Fetch the remainingBid value from the database
    const previousBid = await Bid.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (userResponse === "yes" && previousBid && previousBid.remainingBid !== undefined) {
      totalBidAmount = parseInt(previousBid.remainingBid) + parseInt(bidAmount);
      remainingBid = 0;
    } else {
      totalBidAmount = parseInt(bidAmount);
      remainingBid = previousBid ? previousBid.remainingBid : undefined;
    }

    // Create the bid with bidAmount, remainingBid, and totalBidAmount fields
    const newBid = await Bid.create({
      bidAmount,
      remainingBid,
      totalBidAmount,
    });

    res.status(200).json({
      message: "Bid created successfully",
      remainingBid,
      totalBidAmount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
