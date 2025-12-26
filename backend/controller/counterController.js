const Counter = require("../models/counter");
const User = require("../models/user");

/* ===================== CREATE COUNTER ===================== */
const createCounter = async (req, res, next) => {
    try {
        const { name, operator, services } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Counter name is required" });
        }

        let operatorData = null;
        if (operator && operator.id) {
            const user = await User.findById(operator.id);
            if (user) {
                operatorData = {
                    id: user._id,
                    name: user.fullName,
                    avatar: user.fullName.split(' ').map(n => n[0]).join('')
                };
            }
        }

        const newCounter = new Counter({
            name,
            operator: operatorData || { id: null, name: null, avatar: null },
            services: services || [],
            status: "offline",
            currentToken: null,
            tokensServed: 0,
            avgServiceTime: 0,
            startedAt: null
        });

        await newCounter.save();

        res.status(201).json({
            message: "Counter created successfully",
            counter: newCounter
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== READ ALL COUNTERS ===================== */
const readCounters = async (req, res, next) => {
    try {
        const counters = await Counter.find()
            .populate({
                path: 'currentToken',
                select: 'tokenNumber serviceName status priority customer',
                populate: {
                    path: 'customer',
                    select: 'fullName phoneNumber'
                }
            })
            .sort({ createdAt: 1 });
        res.json(counters);
    } catch (error) {
        next(error);
    }
};

/* ===================== READ COUNTER BY ID ===================== */
const readCounterById = async (req, res, next) => {
    try {
        const counter = await Counter.findById(req.params.id);

        if (!counter) {
            return res.status(404).json({ message: "Counter not found" });
        }

        res.json(counter);
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE COUNTER ===================== */
const updateCounter = async (req, res, next) => {
    try {
        const { name, operator, services } = req.body;

        let updatedData = {};

        if (name) updatedData.name = name;
        if (services) updatedData.services = services;

        if (operator !== undefined) {
            if (operator && operator.id) {
                const user = await User.findById(operator.id);
                if (user) {
                    updatedData.operator = {
                        id: user._id,
                        name: user.fullName,
                        avatar: user.fullName.split(' ').map(n => n[0]).join('')
                    };
                }
            } else {
                updatedData.operator = { id: null, name: null, avatar: null };
            }
        }

        const updatedCounter = await Counter.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        if (!updatedCounter) {
            return res.status(404).json({ message: "Counter not found" });
        }

        res.json({
            message: "Counter updated successfully",
            counter: updatedCounter
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== DELETE COUNTER ===================== */
const deleteCounter = async (req, res, next) => {
    try {
        const deletedCounter = await Counter.findByIdAndDelete(req.params.id);
        if (!deletedCounter) {
            return res.status(404).json({ message: "Counter not found" });
        }
        res.json({ message: "Counter deleted successfully" });
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE COUNTER STATUS ===================== */
const updateCounterStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ["serving", "available", "break", "offline"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const counter = await Counter.findById(req.params.id);

        if (!counter) {
            return res.status(404).json({ message: "Counter not found" });
        }

        counter.status = status;

        if (status === "available" && !counter.startedAt) {
            counter.startedAt = new Date();
        }

        if (status === "offline") {
            counter.startedAt = null;
            counter.currentToken = null;
        }

        await counter.save();

        res.json({
            message: `Counter status updated to ${status}`,
            counter
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== GET COUNTER STATS ===================== */
const getCounterStats = async (req, res, next) => {
    try {
        const counters = await Counter.find();

        const stats = {
            total: counters.length,
            serving: counters.filter(c => c.status === 'serving').length,
            active: counters.filter(c => c.status === 'serving' || c.status === 'available').length,
            totalServed: counters.reduce((sum, c) => sum + c.tokensServed, 0)
        };

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

/* ===================== GET OPERATORS LIST ===================== */
const getOperators = async (req, res, next) => {
    try {
        const operators = await User.find({
            role: { $in: ['operator', 'admin'] }
        }).select('_id fullName');

        const formattedOperators = operators.map(op => ({
            value: op._id,
            label: op.fullName
        }));

        res.json(formattedOperators);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCounter,
    readCounters,
    readCounterById,
    updateCounter,
    deleteCounter,
    updateCounterStatus,
    getCounterStats,
    getOperators
};
