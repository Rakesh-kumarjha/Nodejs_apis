import express from "express";
import { signUp } from "../create-api/signup.js";
import { logIn } from "../create-api/login.js";
import { updateContact } from "../create-api/update.js";
import { getAlldata } from "../create-api/getall.js";
import { getId } from "../create-api/getid.js";
import { createBid } from "../admin/createbid.js";
import { requestBid } from "../admin/onginigbid.js";
import { authenticateUser } from "../admin/userauth.js";
import { approveBidRequest } from "../admin/approval.js";
import { getPendingBidRequests } from "../admin/getnewrequest.js";


const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.put("/update/:name", updateContact);
router.get("/getalldata", getAlldata);
router.get("/get", getId);
router.post("/createbid", createBid);
router.post("/buyfrombidrequest", requestBid);
router.post("/approval",authenticateUser  , approveBidRequest);
router.get("/bid/pending", getPendingBidRequests);

export default router;
