import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        heroName: {
            type: String,
            required: [true, 'Hero name is required.'],
        },
        itemName: {
            type: String,
            required: [true, 'Item name is required.'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required.'],
        },
        classId: {
            type: String,
            required: false,
        },
        instanceId: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            required: false,
        },
        nameColor: {
            type: String,
            required: false,
        },
        steamMarket: {
            price: {
                type: Number,
                required: false,
            },
            quantity: {
                type: Number,
                required: false,
            },
            marketId: {
                type: Number,
                required: false,
            },
            minBuyOrder: {
                type: Number,
                required: false,
            },
            data: {
                byWeeksData: {
                    type: Array,
                    required: false,
                },
                monthData: {
                    type: Array,
                    required: false,
                },
            },
            stats: {
                minPriceYear: {
                    type: Number,
                    required: false,
                },
                maxPriceYear: {
                    type: Number,
                    required: false,
                },
                averagePriceYear: {
                    type: Number,
                    required: false,
                },
                averageSalesYear: {
                    type: Number,
                    required: false,
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Item", itemSchema);