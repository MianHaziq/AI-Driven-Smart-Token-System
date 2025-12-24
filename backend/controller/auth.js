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
            process.env.secret,
            { expiresIn: "1h" }
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

module.exports = { signup, login };
