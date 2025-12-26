const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const isAdmin = require("../middleware/isAdmin");
const {
    createUser,
    readUser,
    readUserId,
    updateUser,
    deleteUserbyid
} = require("../controller/userController");

// All user management routes require admin access
router.post("/create", authorization, isAdmin, createUser);
router.get("/read", authorization, isAdmin, readUser);
router.get("/read/:id", authorization, isAdmin, readUserId);
router.patch("/update/:id", authorization, isAdmin, updateUser);
router.delete("/delete/:id", authorization, isAdmin, deleteUserbyid);

module.exports = router;
