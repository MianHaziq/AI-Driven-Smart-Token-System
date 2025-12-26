const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const isAdmin = require("../middleware/isAdmin");
const {
    createService,
    readServices,
    readServiceById,
    updateService,
    deleteService,
    toggleServiceStatus,
    getServiceStats
} = require("../controller/serviceController");

// Public routes - users can view services
router.get("/read", readServices);
router.get("/read/:id", readServiceById);

// Admin routes - only admins can modify services
router.post("/create", authorization, isAdmin, createService);
router.get("/stats", authorization, isAdmin, getServiceStats);
router.patch("/update/:id", authorization, isAdmin, updateService);
router.patch("/toggle/:id", authorization, isAdmin, toggleServiceStatus);
router.delete("/delete/:id", authorization, isAdmin, deleteService);

module.exports = router;
