import Sequelize from "sequelize";
import sequelize from "../utilities/database.js";

const Bid = sequelize.define("bid", {
  BidId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  bidAmount: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  remainingBid: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  totalBidAmount: {
    type: Sequelize.BIGINT,
    allowNull: true,
    defaultValue: null, 
  },
  bidRequest: {  
    type: Sequelize.STRING,
    allowNull: true,
  },
});

export default Bid;
