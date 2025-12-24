const express = require("express");
const router = express.Router();
const {
    createCounter,
    readCounters,
    readCounterById,
    updateCounter,
    deleteCounter,
    updateCounterStatus,
    getCounterStats,
    getOperators
} = require("../controller/counterController");

// Counter routes
router.post("/create", createCounter);
router.get("/read", readCounters);
router.get("/stats", getCounterStats);
router.get("/operators", getOperators);
router.get("/read/:id", readCounterById);
router.patch("/update/:id", updateCounter);
router.patch("/status/:id", updateCounterStatus);
router.delete("/delete/:id", deleteCounter);

module.exports = router;
