const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
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
    cancelToken
} = require("../controller/tokenController");

// Public routes
router.get("/queue", getQueueStatus);
router.get("/stats", getDashboardStats);
router.get("/number/:tokenNumber", getTokenByNumber);

// Protected routes (require authentication)
router.post("/book", authorization, bookToken);
router.get("/my-tokens", authorization, getMyTokens);
router.get("/:id", authorization, getTokenById);
router.patch("/cancel/:tokenId", authorization, cancelToken);

// Admin routes
router.post("/call-next", authorization, callNextToken);
router.patch("/complete/:tokenId", authorization, completeToken);
router.patch("/no-show/:tokenId", authorization, markNoShow);

module.exports = router;
