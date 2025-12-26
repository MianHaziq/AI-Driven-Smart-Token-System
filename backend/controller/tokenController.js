const mongoose = require("mongoose");
const Token = require("../models/token");
const Service = require("../models/service");
const Counter = require("../models/counter");
const Settings = require("../models/settings");

/* ===================== HELPER: CHECK IF VALID OBJECTID ===================== */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

/* ===================== HELPER: GET OR CREATE SETTINGS ===================== */
const getSettings = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings();
        await settings.save();
    }
    return settings;
};

/* ===================== HELPER: GENERATE TOKEN NUMBER ===================== */
const generateTokenNumber = async () => {
    const settings = await getSettings();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Reset counter if it's a new day
    if (!settings.lastTokenDate || new Date(settings.lastTokenDate) < today) {
        settings.dailyTokenCounter = 0;
        settings.lastTokenDate = today;
    }

    settings.dailyTokenCounter += 1;
    await settings.save();

    const tokenNum = settings.dailyTokenCounter.toString().padStart(3, '0');
    return `${settings.tokenPrefix}-${tokenNum}`;
};

/* ===================== BOOK TOKEN ===================== */
const bookToken = async (req, res, next) => {
    try {
        const { serviceId, priority, serviceCenter, city } = req.body;
        const customerId = req.user.id;

        if (!serviceId) {
            return res.status(400).json({ message: "Service is required" });
        }

        // Find service by ObjectId or slug
        let service;
        if (isValidObjectId(serviceId)) {
            service = await Service.findById(serviceId);
        } else {
            // Try finding by slug
            service = await Service.findOne({ slug: serviceId });
        }

        if (!service) {
            return res.status(404).json({ message: "Service not found. Please ensure services are seeded in the database." });
        }

        if (!service.isActive) {
            return res.status(400).json({ message: "Service is currently not available" });
        }

        // Get current waiting tokens for this service
        const waitingTokens = await Token.countDocuments({
            status: "waiting",
            createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
        });

        const tokenNumber = await generateTokenNumber();
        const position = waitingTokens + 1;
        const estimatedWaitTime = position * service.avgTime;

        const newToken = new Token({
            tokenNumber,
            customer: customerId,
            service: service._id,  // Use actual MongoDB ObjectId
            serviceName: service.name,
            serviceCenter: serviceCenter || null,
            city: city || null,
            status: "waiting",
            priority: priority || "normal",
            position,
            estimatedWaitTime
        });

        await newToken.save();

        // Update service stats
        service.tokensToday += 1;
        service.totalTokens += 1;
        await service.save();

        res.status(201).json({
            message: "Token booked successfully",
            token: {
                _id: newToken._id,
                tokenNumber: newToken.tokenNumber,
                position: newToken.position,
                estimatedWaitTime: newToken.estimatedWaitTime,
                serviceName: service.name,
                serviceCenter: newToken.serviceCenter,
                city: newToken.city,
                status: newToken.status,
                priority: newToken.priority,
                createdAt: newToken.createdAt
            }
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== GET QUEUE STATUS ===================== */
const getQueueStatus = async (req, res, next) => {
    try {
        const { service, city, serviceCenter, status } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Build query with optional filters
        const query = {
            createdAt: { $gte: today }
        };

        // Filter by service (can be ObjectId or slug)
        if (service) {
            if (isValidObjectId(service)) {
                query.service = service;
            } else {
                // Find service by slug first
                const serviceDoc = await Service.findOne({ slug: service });
                if (serviceDoc) {
                    query.service = serviceDoc._id;
                }
            }
        }

        // Filter by city
        if (city) {
            query.city = city;
        }

        // Filter by service center
        if (serviceCenter) {
            query.serviceCenter = serviceCenter;
        }

        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }

        const tokens = await Token.find(query)
            .populate('customer', 'fullName phoneNumber')
            .populate('service', 'name slug category')
            .sort({ position: 1 });

        const waiting = tokens.filter(t => t.status === 'waiting');
        const serving = tokens.filter(t => t.status === 'serving');
        const completed = tokens.filter(t => t.status === 'completed');
        const noShows = tokens.filter(t => t.status === 'no-show');

        res.json({
            total: tokens.length,
            waiting: waiting.length,
            serving: serving.length,
            completed: completed.length,
            noShows: noShows.length,
            tokens: tokens.map(t => ({
                _id: t._id,
                tokenNumber: t.tokenNumber,
                customerName: t.customer?.fullName || 'Customer',
                customerPhone: t.customer?.phoneNumber || '',
                serviceName: t.serviceName,
                serviceCenter: t.serviceCenter,
                city: t.city,
                priority: t.priority,
                position: t.position,
                status: t.status,
                estimatedWaitTime: t.estimatedWaitTime,
                createdAt: t.createdAt,
                calledAt: t.calledAt,
                completedAt: t.completedAt
            })),
            queue: waiting.slice(0, 10).map(t => ({
                _id: t._id,
                tokenNumber: t.tokenNumber,
                customerName: t.customer?.fullName || 'Customer',
                customerPhone: t.customer?.phoneNumber || '',
                serviceName: t.serviceName,
                serviceCenter: t.serviceCenter,
                city: t.city,
                priority: t.priority,
                position: t.position,
                estimatedWaitTime: t.estimatedWaitTime,
                createdAt: t.createdAt
            })),
            currentlyServing: serving.map(t => ({
                _id: t._id,
                tokenNumber: t.tokenNumber,
                customerName: t.customer?.fullName || 'Customer',
                serviceName: t.serviceName,
                serviceCenter: t.serviceCenter,
                city: t.city,
                counter: t.counter
            }))
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== CALL NEXT TOKEN ===================== */
const callNextToken = async (req, res, next) => {
    try {
        const { counterId, serviceCenter, city } = req.body;

        // Find or assign a counter
        let counter;
        if (counterId && isValidObjectId(counterId)) {
            counter = await Counter.findById(counterId);
        }

        // If no counter specified or not found, find any available counter
        if (!counter) {
            counter = await Counter.findOne({ status: "available" });
        }

        // If still no counter, create default ones or find one that's not serving
        if (!counter) {
            const existingCounters = await Counter.find();
            if (existingCounters.length === 0) {
                // Create default counters
                const defaultCounters = [
                    { name: "Counter 1", status: "available" },
                    { name: "Counter 2", status: "available" },
                    { name: "Counter 3", status: "available" },
                ];
                await Counter.insertMany(defaultCounters);
                counter = await Counter.findOne({ status: "available" });
            } else {
                // Try to find any counter not currently serving
                counter = await Counter.findOne({ status: { $ne: "serving" } });
                if (!counter) {
                    return res.status(400).json({ message: "All counters are busy. Please wait." });
                }
            }
        }

        // Build query for next waiting token with optional filters
        const tokenQuery = { status: "waiting" };
        if (serviceCenter) tokenQuery.serviceCenter = serviceCenter;
        if (city) tokenQuery.city = city;

        // Find next waiting token (prioritize by priority, then position)
        const nextToken = await Token.findOne(tokenQuery).sort({
            priority: -1, // VIP > PWD > Senior > Normal
            position: 1
        }).populate('customer', 'fullName phoneNumber');

        if (!nextToken) {
            return res.status(404).json({ message: "No tokens in queue" });
        }

        // Update token
        nextToken.status = "serving";
        nextToken.counter = counter._id;
        nextToken.calledAt = new Date();
        nextToken.serviceStartTime = new Date();
        await nextToken.save();

        // Update counter
        counter.status = "serving";
        counter.currentToken = nextToken._id;
        await counter.save();

        res.json({
            message: "Token called successfully",
            token: {
                _id: nextToken._id,
                tokenNumber: nextToken.tokenNumber,
                serviceName: nextToken.serviceName,
                serviceCenter: nextToken.serviceCenter,
                city: nextToken.city,
                customerName: nextToken.customer?.fullName || 'Customer',
                customerPhone: nextToken.customer?.phoneNumber || '',
                priority: nextToken.priority,
                status: nextToken.status
            },
            counter: {
                _id: counter._id,
                name: counter.name
            }
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== COMPLETE TOKEN ===================== */
const completeToken = async (req, res, next) => {
    try {
        const { tokenId } = req.params;

        const token = await Token.findById(tokenId);
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        if (token.status !== "serving") {
            return res.status(400).json({ message: "Token is not currently being served" });
        }

        // Calculate actual service time
        const serviceEndTime = new Date();
        const actualWaitTime = token.serviceStartTime
            ? Math.round((serviceEndTime - token.serviceStartTime) / 60000)
            : 0;

        token.status = "completed";
        token.serviceEndTime = serviceEndTime;
        token.completedAt = serviceEndTime;
        token.actualWaitTime = actualWaitTime;
        await token.save();

        // Update counter
        if (token.counter) {
            const counter = await Counter.findById(token.counter);
            if (counter) {
                counter.status = "available";
                counter.currentToken = null;
                counter.tokensServed += 1;

                // Update average service time
                const totalTime = counter.avgServiceTime * (counter.tokensServed - 1) + actualWaitTime;
                counter.avgServiceTime = Math.round(totalTime / counter.tokensServed);

                await counter.save();
            }
        }

        // Update positions of remaining tokens
        await Token.updateMany(
            { status: "waiting", position: { $gt: token.position } },
            { $inc: { position: -1 } }
        );

        res.json({
            message: "Token completed successfully",
            token: {
                tokenNumber: token.tokenNumber,
                actualWaitTime
            }
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== MARK NO-SHOW ===================== */
const markNoShow = async (req, res, next) => {
    try {
        const { tokenId } = req.params;

        const token = await Token.findById(tokenId);
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        token.status = "no-show";
        token.completedAt = new Date();
        await token.save();

        // Update counter if this token was being served
        if (token.counter) {
            const counter = await Counter.findById(token.counter);
            if (counter) {
                counter.status = "available";
                counter.currentToken = null;
                await counter.save();
            }
        }

        // Update positions of remaining tokens
        await Token.updateMany(
            { status: "waiting", position: { $gt: token.position } },
            { $inc: { position: -1 } }
        );

        res.json({
            message: "Token marked as no-show",
            tokenNumber: token.tokenNumber
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== GET TOKEN BY ID ===================== */
const getTokenById = async (req, res, next) => {
    try {
        const token = await Token.findById(req.params.id)
            .populate('customer', 'fullName phoneNumber email')
            .populate('service', 'name nameUrdu category fee');

        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        res.json(token);
    } catch (error) {
        next(error);
    }
};

/* ===================== GET MY TOKENS ===================== */
const getMyTokens = async (req, res, next) => {
    try {
        const customerId = req.user.id;

        const tokens = await Token.find({ customer: customerId })
            .populate('service', 'name nameUrdu category')
            .sort({ createdAt: -1 });

        res.json({ tokens });
    } catch (error) {
        next(error);
    }
};

/* ===================== GET TOKEN BY NUMBER ===================== */
const getTokenByNumber = async (req, res, next) => {
    try {
        const { tokenNumber } = req.params;

        const token = await Token.findOne({ tokenNumber })
            .populate('customer', 'fullName phoneNumber')
            .populate('service', 'name nameUrdu category');

        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        res.json(token);
    } catch (error) {
        next(error);
    }
};

/* ===================== GET DASHBOARD STATS ===================== */
const getDashboardStats = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tokens = await Token.find({
            createdAt: { $gte: today }
        });

        const completed = tokens.filter(t => t.status === 'completed');
        const avgWaitTime = completed.length > 0
            ? Math.round(completed.reduce((sum, t) => sum + t.actualWaitTime, 0) / completed.length)
            : 0;

        const stats = {
            totalTokens: tokens.length,
            waiting: tokens.filter(t => t.status === 'waiting').length,
            completed: completed.length,
            noShows: tokens.filter(t => t.status === 'no-show').length,
            avgWaitTime,
            efficiency: tokens.length > 0
                ? Math.round((completed.length / tokens.length) * 100)
                : 0
        };

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

/* ===================== CANCEL TOKEN ===================== */
const cancelToken = async (req, res, next) => {
    try {
        const { tokenId } = req.params;
        const customerId = req.user.id;

        const token = await Token.findById(tokenId);
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        // Only allow customer to cancel their own token
        if (token.customer.toString() !== customerId && req.user.role === 'user') {
            return res.status(403).json({ message: "Not authorized to cancel this token" });
        }

        if (token.status !== "waiting") {
            return res.status(400).json({ message: "Can only cancel waiting tokens" });
        }

        token.status = "cancelled";
        await token.save();

        // Update positions of remaining tokens
        await Token.updateMany(
            { status: "waiting", position: { $gt: token.position } },
            { $inc: { position: -1 } }
        );

        res.json({
            message: "Token cancelled successfully",
            tokenNumber: token.tokenNumber
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
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
};
