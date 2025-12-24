const express = require("express");
const router = express.Router();
const {
    createService,
    readServices,
    readServiceById,
    updateService,
    deleteService,
    toggleServiceStatus,
    getServiceStats
} = require("../controller/serviceController");

// Service routes
router.post("/create", createService);
router.get("/read", readServices);
router.get("/stats", getServiceStats);
router.get("/read/:id", readServiceById);
router.patch("/update/:id", updateService);
router.patch("/toggle/:id", toggleServiceStatus);
router.delete("/delete/:id", deleteService);

module.exports = router;
