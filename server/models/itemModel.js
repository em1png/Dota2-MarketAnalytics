import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    heroName: { type: String, required: true },
    itemName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    classid: String,
    instanceid: String,
    type: String,
    nameColor: String,

    price: {
      steam: Number,
      d2market: Number,
    },

    steamData: {
      marketId: Number,
      buyOrder: Number,

      sellListings: Number,
    
      byWeeksData: Array,
      monthData: Array,

      minPriceYear: Number,
      maxPriceYear: Number,

      minPriceAlltime: Number,
      maxPriceAlltime: Number,

      averagePriceYear: Number,
      averagePriceAlltime: Number,

      averageSalesYear: Number,
      averageSalesAlltime: Number,

      updated: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Item", itemSchema);
