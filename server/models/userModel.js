import mongoose from "mongoose";
import { AccessLevels } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 30,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            default: null,
        },
        accessLevel: {
            type: String,
            enum: Object.values(AccessLevels),
            default: AccessLevels.USER,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);