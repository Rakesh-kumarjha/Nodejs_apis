import { DataTypes } from "sequelize";
import sequelize from "../utilities/database.js";

const BidRequest = sequelize.define("BidRequest", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false, 
  },
  emailid: {  
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  
  bidstatus: {
    type: DataTypes.ENUM("start", "end"),
    defaultValue: "start", 
  },
});

export default BidRequest;
