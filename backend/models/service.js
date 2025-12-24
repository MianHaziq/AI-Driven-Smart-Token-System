const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        nameUrdu: {
            type: String,
            trim: true,
            default: ""
        },
        category: {
            type: String,
            enum: ["nadra", "passport", "excise", "banks", "utilities"],
            required: true
        },
        avgTime: {
            type: Number,
            required: true,
            default: 15
        },
        fee: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        tokensToday: {
            type: Number,
            default: 0
        },
        totalTokens: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Service = mongoose.model("service", serviceSchema);
module.exports = Service;
