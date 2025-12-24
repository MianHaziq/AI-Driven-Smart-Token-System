const express = require("express");
const router = express.Router();
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

// Settings routes
router.get("/", getSettings);
router.put("/", updateSettings);
router.patch("/general", updateGeneralSettings);
router.patch("/queue", updateQueueSettings);
router.patch("/notifications", updateNotificationSettings);
router.patch("/hours", updateOperatingHours);
router.patch("/display", updateDisplaySettings);
router.post("/reset-counter", resetDailyCounter);

module.exports = router;
