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
    resetDailyCounter
} = require("../controller/settingsController");

// All settings routes require admin access
router.get("/", authorization, isAdmin, getSettings);
router.put("/", authorization, isAdmin, updateSettings);
router.patch("/general", authorization, isAdmin, updateGeneralSettings);
router.patch("/queue", authorization, isAdmin, updateQueueSettings);
router.patch("/notifications", authorization, isAdmin, updateNotificationSettings);
router.patch("/hours", authorization, isAdmin, updateOperatingHours);
router.patch("/display", authorization, isAdmin, updateDisplaySettings);
router.post("/reset-counter", authorization, isAdmin, resetDailyCounter);

module.exports = router;
