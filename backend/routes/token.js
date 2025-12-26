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
    cancelToken
} = require("../controller/tokenController");

// Public routes
router.get("/queue", getQueueStatus);
router.get("/stats", getDashboardStats);
router.get("/number/:tokenNumber", getTokenByNumber);

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

module.exports = router;
