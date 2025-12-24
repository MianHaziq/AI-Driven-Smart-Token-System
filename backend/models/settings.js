const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        // General Settings
        centerName: {
            type: String,
            default: "NADRA Office - Islamabad"
        },
        centerCode: {
            type: String,
            default: "ISB-001"
        },
        address: {
            type: String,
            default: "F-8 Markaz, Islamabad"
        },
        phone: {
            type: String,
            default: "051-1234567"
        },
        email: {
            type: String,
            default: "contact@sqp.gov.pk"
        },
        timezone: {
            type: String,
            default: "Asia/Karachi"
        },
        language: {
            type: String,
            default: "en"
        },

        // Queue Settings
        maxQueueSize: {
            type: Number,
            default: 200
        },
        avgServiceTime: {
            type: Number,
            default: 15
        },
        tokenPrefix: {
            type: String,
            default: "A"
        },
        autoCallEnabled: {
            type: Boolean,
            default: true
        },
        noShowTimeout: {
            type: Number,
            default: 5
        },
        priorityEnabled: {
            type: Boolean,
            default: true
        },

        // Notifications
        smsEnabled: {
            type: Boolean,
            default: true
        },
        emailEnabled: {
            type: Boolean,
            default: true
        },
        pushEnabled: {
            type: Boolean,
            default: true
        },
        notifyBefore: {
            type: Number,
            default: 3
        },
        reminderInterval: {
            type: Number,
            default: 10
        },

        // Operating Hours
        openTime: {
            type: String,
            default: "09:00"
        },
        closeTime: {
            type: String,
            default: "17:00"
        },
        breakStart: {
            type: String,
            default: "13:00"
        },
        breakEnd: {
            type: String,
            default: "14:00"
        },
        workDays: {
            type: [String],
            default: ["mon", "tue", "wed", "thu", "fri"]
        },

        // Display
        displayLanguage: {
            type: String,
            default: "bilingual"
        },
        showEstimatedWait: {
            type: Boolean,
            default: true
        },
        showQueuePosition: {
            type: Boolean,
            default: true
        },
        announcementVolume: {
            type: Number,
            default: 80
        },
        darkMode: {
            type: Boolean,
            default: false
        },

        // Token Counter (for generating token numbers)
        dailyTokenCounter: {
            type: Number,
            default: 0
        },
        lastTokenDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Settings = mongoose.model("settings", settingsSchema);
module.exports = Settings;
