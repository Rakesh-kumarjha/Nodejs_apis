import BidRequest from "../models/bidrequest.js";

export const getPendingBidRequests = async (req, res, next) => {
  try {
    const pendingBidRequests = await BidRequest.findAll({
      where: { status: "pending" },
    });

    res.status(200).json({
      message: "Pending bid requests fetched successfully",
      pendingBidRequests: pendingBidRequests,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
