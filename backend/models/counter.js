const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["serving", "available", "break", "offline"],
            default: "offline"
        },
        currentToken: {
            type: String,
            default: null
        },
        operator: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                default: null
            },
            name: {
                type: String,
                default: null
            },
            avatar: {
                type: String,
                default: null
            }
        },
        tokensServed: {
            type: Number,
            default: 0
        },
        avgServiceTime: {
            type: Number,
            default: 0
        },
        services: [{
            type: String,
            enum: ["nadra", "passport", "excise", "banks", "utilities"]
        }],
        startedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Counter = mongoose.model("counter", counterSchema);
module.exports = Counter;
