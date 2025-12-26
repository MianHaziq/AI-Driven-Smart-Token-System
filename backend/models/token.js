const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
        tokenNumber: {
            type: String,
            required: true
            // Note: Removed unique constraint - tokens reset daily
            // Uniqueness is now per-day via compound index below
        },
        tokenDate: {
            type: Date,
            required: true,
            default: () => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return today;
            }
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "service",
            required: true
        },
        serviceName: {
            type: String,
            required: true
        },
        serviceCenter: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        status: {
            type: String,
            enum: ["waiting", "serving", "completed", "no-show", "cancelled"],
            default: "waiting"
        },
        priority: {
            type: String,
            enum: ["normal", "senior", "disabled", "vip"],
            default: "normal"
        },
        position: {
            type: Number,
            required: true
        },
        counter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "counter",
            default: null
        },
        estimatedWaitTime: {
            type: Number,
            default: 0
        },
        actualWaitTime: {
            type: Number,
            default: 0
        },
        serviceStartTime: {
            type: Date,
            default: null
        },
        serviceEndTime: {
            type: Date,
            default: null
        },
        calledAt: {
            type: Date,
            default: null
        },
        completedAt: {
            type: Date,
            default: null
        },
        feedback: {
            rating: {
                type: Number,
                min: 1,
                max: 5,
                default: null
            },
            comment: {
                type: String,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
tokenSchema.index({ status: 1, createdAt: 1 });
tokenSchema.index({ customer: 1, createdAt: -1 });
tokenSchema.index({ tokenDate: 1, status: 1 }); // For daily queue queries

// Compound unique index: token numbers are unique per day
tokenSchema.index({ tokenNumber: 1, tokenDate: 1 }, { unique: true });

const Token = mongoose.model("token", tokenSchema);
module.exports = Token;
