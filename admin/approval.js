import Bid from "../models/bid.js";
import User from "../models/users.js";
import BidRequest from "../models/bidrequest.js";

export const approveBidRequest = async (req, res, next) => {
  const { bidRequestId, action } = req.body;
  console.log(bidRequestId);
  try {
    const bidRequest = await BidRequest.findByPk(bidRequestId);
    if (!bidRequest) {
      return res.status(404).json({ message: "Bid request not found" });
    }

    if (bidRequest.status !== "pending") {
      return res.status(400).json({ message: "Bid request is already processed" });
    }

    const previousBid = await Bid.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (!previousBid) {
      return res.status(404).json({ message: "No previous bid found" });
    }

    const totalBidAmount = previousBid.totalBidAmount;
    const previousRemainingBid = previousBid.remainingBid;
    const bidResult = totalBidAmount - bidRequest.amount;
    const remainingBid = parseFloat(bidResult) + parseFloat(previousRemainingBid);

    if (remainingBid < 0) {
      return res.status(400).json({ message: "Amount exceeds the total bid amount" });
    }

    if (action === "end") {
     
      bidRequest.status = "closed";

     
      previousBid.totalBidAmount = 0;
    } else {
      previousBid.remainingBid = remainingBid;
      await previousBid.save();

      bidRequest.status = action === "accept" ? "approved" : "rejected";
    }

    await bidRequest.save();

    const user = await User.findOne({
      where: {
        emailid: bidRequest.emailid, 
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `Bid request ${action === "accept" ? "approved" : action === "end" ? "closed" : "rejected"} successfully`,
      remainingBid: action === "end" ? 0 : remainingBid,
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An internal server error occurred" });
  }
};
