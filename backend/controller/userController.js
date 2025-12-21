const userModel = require("../Models/user");
const bcrypt = require("bcrypt");

/* ===================== CREATE USER (ADMIN USE) ===================== */
const createUser = async (req, res, next) => {
    try {
        const { fullName, phoneNumber, cnic, email, password, role } = req.body;

        if (!fullName || !phoneNumber || !cnic || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (await userModel.findOne({ email })) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            fullName,
            phoneNumber,
            cnic,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== READ USERS ===================== */
const readUser = async (req, res, next) => {
    try {
        const users = await userModel.find().select("-password");
        if (!users.length) {
            return res.status(404).json({ message: "No users found" });
        }
        res.json(users);
    } catch (error) {
        next(error);
    }
};

/* ===================== READ USER BY ID ===================== */
const readUserId = async (req, res, next) => {
    try {
        const user = await userModel
            .findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE USER ===================== */
const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { fullName, phoneNumber, cnic, email, password, role } = req.body;

        let updatedData = {};

        if (fullName) updatedData.fullName = fullName;
        if (phoneNumber) updatedData.phoneNumber = phoneNumber;
        if (cnic) updatedData.cnic = cnic;
        if (email) updatedData.email = email;

        if (role) {
            updatedData.role = role; // admin can update
        }

        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await userModel
            .findByIdAndUpdate(id, updatedData, { new: true })
            .select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User updated successfully",
            updatedUser
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== DELETE USER ===================== */
const deleteUserbyid = async (req, res, next) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    readUser,
    readUserId,
    updateUser,
    deleteUserbyid
};
