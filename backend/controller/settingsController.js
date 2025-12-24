const Settings = require("../models/settings");

/* ===================== GET SETTINGS ===================== */
const getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();

        // Create default settings if none exist
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }

        res.json(settings);
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE SETTINGS ===================== */
const updateSettings = async (req, res, next) => {
    try {
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData._id;
        delete updateData.dailyTokenCounter;
        delete updateData.lastTokenDate;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings(updateData);
        } else {
            Object.assign(settings, updateData);
        }

        await settings.save();

        res.json({
            message: "Settings updated successfully",
            settings
        });
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE GENERAL SETTINGS ===================== */
const updateGeneralSettings = async (req, res, next) => {
    try {
        const { centerName, centerCode, address, phone, email, timezone, language } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        if (centerName !== undefined) settings.centerName = centerName;
        if (centerCode !== undefined) settings.centerCode = centerCode;
        if (address !== undefined) settings.address = address;
        if (phone !== undefined) settings.phone = phone;
        if (email !== undefined) settings.email = email;
        if (timezone !== undefined) settings.timezone = timezone;
        if (language !== undefined) settings.language = language;

        await settings.save();

        res.json({
            message: "General settings updated successfully",
            settings
        });
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE QUEUE SETTINGS ===================== */
const updateQueueSettings = async (req, res, next) => {
    try {
        const { maxQueueSize, avgServiceTime, tokenPrefix, autoCallEnabled, noShowTimeout, priorityEnabled } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        if (maxQueueSize !== undefined) settings.maxQueueSize = maxQueueSize;
        if (avgServiceTime !== undefined) settings.avgServiceTime = avgServiceTime;
        if (tokenPrefix !== undefined) settings.tokenPrefix = tokenPrefix;
        if (autoCallEnabled !== undefined) settings.autoCallEnabled = autoCallEnabled;
        if (noShowTimeout !== undefined) settings.noShowTimeout = noShowTimeout;
        if (priorityEnabled !== undefined) settings.priorityEnabled = priorityEnabled;

        await settings.save();

        res.json({
            message: "Queue settings updated successfully",
            settings
        });
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE NOTIFICATION SETTINGS ===================== */
const updateNotificationSettings = async (req, res, next) => {
    try {
        const { smsEnabled, emailEnabled, pushEnabled, notifyBefore, reminderInterval } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        if (smsEnabled !== undefined) settings.smsEnabled = smsEnabled;
        if (emailEnabled !== undefined) settings.emailEnabled = emailEnabled;
        if (pushEnabled !== undefined) settings.pushEnabled = pushEnabled;
        if (notifyBefore !== undefined) settings.notifyBefore = notifyBefore;
        if (reminderInterval !== undefined) settings.reminderInterval = reminderInterval;

        await settings.save();

        res.json({
            message: "Notification settings updated successfully",
            settings
        });
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE OPERATING HOURS ===================== */
const updateOperatingHours = async (req, res, next) => {
    try {
        const { openTime, closeTime, breakStart, breakEnd, workDays } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        if (openTime !== undefined) settings.openTime = openTime;
        if (closeTime !== undefined) settings.closeTime = closeTime;
        if (breakStart !== undefined) settings.breakStart = breakStart;
        if (breakEnd !== undefined) settings.breakEnd = breakEnd;
        if (workDays !== undefined) settings.workDays = workDays;

        await settings.save();

        res.json({
            message: "Operating hours updated successfully",
            settings
        });
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE DISPLAY SETTINGS ===================== */
const updateDisplaySettings = async (req, res, next) => {
    try {
        const { displayLanguage, showEstimatedWait, showQueuePosition, announcementVolume, darkMode } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        if (displayLanguage !== undefined) settings.displayLanguage = displayLanguage;
        if (showEstimatedWait !== undefined) settings.showEstimatedWait = showEstimatedWait;
        if (showQueuePosition !== undefined) settings.showQueuePosition = showQueuePosition;
        if (announcementVolume !== undefined) settings.announcementVolume = announcementVolume;
        if (darkMode !== undefined) settings.darkMode = darkMode;

        await settings.save();

        res.json({
            message: "Display settings updated successfully",
            settings
        });
    } catch (error) {
        next(error);
    }
};

/* ===================== RESET DAILY COUNTER ===================== */
const resetDailyCounter = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        settings.dailyTokenCounter = 0;
        settings.lastTokenDate = new Date();
        await settings.save();

        res.json({
            message: "Daily counter reset successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSettings,
    updateSettings,
    updateGeneralSettings,
    updateQueueSettings,
    updateNotificationSettings,
    updateOperatingHours,
    updateDisplaySettings,
    resetDailyCounter
};
