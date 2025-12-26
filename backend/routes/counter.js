const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const isAdmin = require("../middleware/isAdmin");
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

// All counter routes require admin access
router.post("/create", authorization, isAdmin, createCounter);
router.get("/read", authorization, isAdmin, readCounters);
router.get("/stats", authorization, isAdmin, getCounterStats);
router.get("/operators", authorization, isAdmin, getOperators);
router.get("/read/:id", authorization, isAdmin, readCounterById);
router.patch("/update/:id", authorization, isAdmin, updateCounter);
router.patch("/status/:id", authorization, isAdmin, updateCounterStatus);
router.delete("/delete/:id", authorization, isAdmin, deleteCounter);

module.exports = router;
