const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

/* ===================== SIGNUP ===================== */
const signup = async (req, res, next) => {
    try {
        const { fullName, phoneNumber, cnic, email, password } = req.body;

        if (!fullName || !phoneNumber || !cnic || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (await userModel.findOne({ email })) {
            return res.status(400).json({ message: "Email already in use" });
        }

        if (await userModel.findOne({ phoneNumber })) {
            return res.status(400).json({ message: "Phone number already in use" });
        }

        if (await userModel.findOne({ cnic })) {
            return res.status(400).json({ message: "CNIC already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            fullName,
            phoneNumber,
            cnic,
            email,
            password: hashedPassword,
            role: "user" // default
        });

        await newUser.save();

        res.status(201).json({
            message: "Signup success"
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== LOGIN ===================== */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email & password required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        res.status(200).json({
            message: "Login success",
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== GET CURRENT USER PROFILE ===================== */
const getProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                cnic: user.cnic,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE PROFILE ===================== */
const updateProfile = async (req, res, next) => {
    try {
        const { fullName, phoneNumber, email } = req.body;
        const userId = req.user.id;

        // Check if email is being changed and if it's already in use
        if (email) {
            const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // Check if phone number is being changed and if it's already in use
        if (phoneNumber) {
            const existingUser = await userModel.findOne({ phoneNumber, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: "Phone number already in use" });
            }
        }

        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (email) updateData.email = email;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                cnic: updatedUser.cnic,
                role: updatedUser.role
            }
        });
    } catch (error) {
        next(error);
    }
};

/* ===================== CHANGE PASSWORD ===================== */
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
};

/* ===================== DELETE ACCOUNT ===================== */
const deleteAccount = async (req, res, next) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;

        if (!password) {
            return res.status(400).json({ message: "Password is required to delete account" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password is incorrect" });
        }

        await userModel.findByIdAndDelete(userId);

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login, getProfile, updateProfile, changePassword, deleteAccount };
