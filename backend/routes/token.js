const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const isAdmin = require("../middleware/isAdmin");
const { validateTokenBooking, validateObjectId } = require("../middleware/validators");
const {
    bookToken,
    getQueueStatus,
    callNextToken,
    completeToken,
    markNoShow,
    getTokenById,
    getMyTokens,
    getTokenByNumber,
    getDashboardStats,
    getAnalytics,
    getQueueCountsByCenter,
    cancelToken,
    markArrived,
    checkExpiredTokens,
    getTokenStatus,
    calculateDistanceToCenter
} = require("../controller/tokenController");

// Public routes
router.get("/queue", getQueueStatus);
router.get("/stats", getDashboardStats);
router.get("/queue-counts", getQueueCountsByCenter);
router.get("/number/:tokenNumber", getTokenByNumber);
router.post("/calculate-distance", calculateDistanceToCenter); // Calculate distance using Google Maps API

// Admin routes for analytics
router.get("/analytics", authorization, isAdmin, getAnalytics);

// Protected routes (require authentication)
router.post("/book", authorization, validateTokenBooking, bookToken);
router.get("/my-tokens", authorization, getMyTokens);
router.get("/:id", authorization, validateObjectId('id'), getTokenById);
router.patch("/cancel/:tokenId", authorization, validateObjectId('tokenId'), cancelToken);

// Admin routes (require admin role)
router.post("/call-next", authorization, isAdmin, callNextToken);
router.patch("/complete/:tokenId", authorization, isAdmin, validateObjectId('tokenId'), completeToken);
router.patch("/no-show/:tokenId", authorization, isAdmin, validateObjectId('tokenId'), markNoShow);
router.patch("/arrived/:tokenId", authorization, isAdmin, validateObjectId('tokenId'), markArrived);
router.post("/check-expired", authorization, isAdmin, checkExpiredTokens);
router.get("/status/:tokenId", authorization, validateObjectId('tokenId'), getTokenStatus);

module.exports = router;
