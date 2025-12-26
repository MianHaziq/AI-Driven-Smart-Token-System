const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const isAdmin = require("../middleware/isAdmin");
const {
    getSettings,
    updateSettings,
    updateGeneralSettings,
    updateQueueSettings,
    updateNotificationSettings,
    updateOperatingHours,
    updateDisplaySettings,
    resetDailyCounter,
    toggleTestMode,
    getTestModeStatus
} = require("../controller/settingsController");

// Public route - get test mode status (no auth required)
router.get("/test-mode", getTestModeStatus);

// All other settings routes require admin access
router.get("/", authorization, isAdmin, getSettings);
router.put("/", authorization, isAdmin, updateSettings);
router.patch("/general", authorization, isAdmin, updateGeneralSettings);
router.patch("/queue", authorization, isAdmin, updateQueueSettings);
router.patch("/notifications", authorization, isAdmin, updateNotificationSettings);
router.patch("/hours", authorization, isAdmin, updateOperatingHours);
router.patch("/display", authorization, isAdmin, updateDisplaySettings);
router.post("/reset-counter", authorization, isAdmin, resetDailyCounter);
router.post("/toggle-test-mode", authorization, isAdmin, toggleTestMode);

module.exports = router;
