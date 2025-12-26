const mongoose = require("mongoose");
const Token = require("../models/token");
const Service = require("../models/service");
const Counter = require("../models/counter");
const Settings = require("../models/settings");
const TokenCounter = require("../models/tokenCounter");
const { getDistanceAndDuration, isGoogleMapsConfigured } = require("../services/googleMaps");

/* ===================== HELPER: CHECK IF VALID OBJECTID ===================== */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

/* ===================== HELPER: CALCULATE DISTANCE (HAVERSINE FORMULA) ===================== */
/**
 * Calculates the distance between two coordinates using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

/* ===================== HELPER: ESTIMATE TRAVEL TIME ===================== */
/**
 * Estimates travel time based on distance.
 * Assumes average city traffic speed of 25 km/h (conservative estimate for Pakistan cities).
 *
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Estimated travel time in minutes
 */
const estimateTravelTime = (distanceKm) => {
    const avgSpeedKmPerHour = 25; // Conservative city traffic speed
    const timeHours = distanceKm / avgSpeedKmPerHour;
    return Math.ceil(timeHours * 60); // Convert to minutes and round up
};

/* ===================== CONSTANTS ===================== */
const MIN_TRAVEL_TIME_MINUTES = 15; // Minimum allowed travel time (even when queue is empty)
const BUFFER_TIME_MINUTES = 5; // Extra buffer time for travel
const ARRIVAL_WINDOW_MINUTES = 5; // Time to arrive after being called
// Formula: travelTime <= max(queueWaitTime, MIN_TRAVEL_TIME) + BUFFER_TIME

/* ===================== HELPER: GET OR CREATE SETTINGS ===================== */
const getSettings = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings();
        await settings.save();
    }
    return settings;
};

/* ===================== HELPER: CALCULATE ESTIMATED WAIT TIME ===================== */
/**
 * Calculates estimated wait time for a new customer joining the queue.
 *
 * FORMULA: ceil(TokensAhead / ActiveCounters) × AvgServiceTime
 *
 * This formula distributes waiting customers across available counters:
 * - If 5 people are waiting and 2 counters are active
 * - Each counter will serve ~3 people (ceil(5/2) = 3)
 * - If avg service time is 10 min, wait = 3 × 10 = 30 min
 *
 * FALLBACK VALUES:
 * - If no active counters: assumes 1 counter (worst case)
 * - If no completed tokens today: uses service.avgTime from database
 *
 * @param {number} tokensAhead - Number of tokens waiting before this customer
 * @param {string} city - City of the service center (optional)
 * @param {string} serviceCenter - Name of the service center (optional)
 * @param {number} defaultAvgTime - Default service time from service definition
 * @returns {Promise<number>} Estimated wait time in minutes
 */
const calculateEstimatedWaitTime = async (tokensAhead, city, serviceCenter, defaultAvgTime) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Step 1: Get number of active counters (status = 'serving' or 'available')
    // Active counters are those that can serve customers
    const activeCounters = await Counter.countDocuments({
        status: { $in: ['serving', 'available'] }
    });

    // Step 2: Get real average service time from today's completed tokens
    // This gives us actual performance data instead of static estimates
    const completedTokensToday = await Token.find({
        tokenDate: today,
        status: 'completed',
        actualWaitTime: { $gt: 0 } // Only tokens with recorded service time
    });

    let avgServiceTime = defaultAvgTime; // Fallback to service definition

    if (completedTokensToday.length > 0) {
        // Calculate average from real completed tokens
        const totalServiceTime = completedTokensToday.reduce(
            (sum, token) => sum + (token.actualWaitTime || 0), 0
        );
        avgServiceTime = Math.round(totalServiceTime / completedTokensToday.length);
    }

    // Step 3: Calculate estimated wait time
    // Use at least 1 counter to avoid division by zero
    const countersToUse = Math.max(activeCounters, 1);

    // ceil(TokensAhead / Counters) gives us how many "rounds" of service
    // before this customer gets served
    const roundsToWait = Math.ceil(tokensAhead / countersToUse);

    // Total wait = rounds × average time per service
    const estimatedWaitTime = roundsToWait * avgServiceTime;

    console.log(`Wait time calculation: ${tokensAhead} ahead / ${countersToUse} counters = ${roundsToWait} rounds × ${avgServiceTime} min = ${estimatedWaitTime} min`);

    return estimatedWaitTime;
};

/* ===================== HELPER: GENERATE TOKEN NUMBER (BRANCH-SPECIFIC) ===================== */
/**
 * Generates token number based on service category and branch
 * Format: {CategoryPrefix}{BranchCode}{Number}
 * Example: NA001 (NADRA, Branch A, Token 1), PB005 (Passport, Branch B, Token 5)
 *
 * Category Prefixes:
 * - NADRA: N
 * - Passport: P
 * - Excise: E
 * - Electricity: L
 * - Sui Gas: G
 * - Banks: B
 *
 * Branch Codes: A, B, C... assigned per city+serviceCenter combination
 */
const generateTokenNumber = async (category, city, serviceCenter) => {
    // Use TokenCounter model for branch-specific token generation
    if (category && city && serviceCenter) {
        return await TokenCounter.getNextTokenNumber(category, city, serviceCenter);
    }

    // Fallback to old method if category/city/center not provided
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let settings = await Settings.findOne();

    if (!settings) {
        settings = new Settings({
            dailyTokenCounter: 1,
            lastTokenDate: today
        });
        await settings.save();
    } else {
        const lastDate = settings.lastTokenDate;
        const isNewDay = !lastDate || lastDate.getTime() < today.getTime();

        if (isNewDay) {
            settings.dailyTokenCounter = 1;
            settings.lastTokenDate = today;
        } else {
            settings.dailyTokenCounter += 1;
        }
        await settings.save();
    }

    const tokenNum = settings.dailyTokenCounter.toString().padStart(3, '0');
    return `${settings.tokenPrefix || 'A'}${tokenNum}`;
};

/* ===================== BOOK TOKEN ===================== */
const bookToken = async (req, res, next) => {
    try {
        const { serviceId, priority, serviceCenter, city, userLocation, centerLocation } = req.body;
        const customerId = req.user.id;

        console.log('Book token request:', { serviceId, priority, serviceCenter, city, customerId, userLocation, centerLocation });

        // Calculate distance and travel time using Google Maps API (or fallback)
        let distanceToCenter = null;
        let estimatedTravelTime = null;
        let distanceSource = null;

        if (userLocation && centerLocation && userLocation.lat && userLocation.lng && centerLocation.lat && centerLocation.lng) {
            // Use Google Maps API for accurate distance and travel time
            const distanceResult = await getDistanceAndDuration(
                { lat: userLocation.lat, lng: userLocation.lng },
                { lat: centerLocation.lat, lng: centerLocation.lng }
            );

            distanceToCenter = distanceResult.distance.km;
            estimatedTravelTime = distanceResult.duration.minutes;
            distanceSource = distanceResult.source;

            console.log(`Distance (${distanceSource}): ${distanceToCenter} km, Travel time: ${estimatedTravelTime} min`);
        }

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

        console.log('Service found:', service ? service.name : 'NOT FOUND');

        if (!service) {
            return res.status(404).json({ message: `Service not found for ID: ${serviceId}. Please run 'node seedServices.js' to seed services.` });
        }

        if (!service.isActive) {
            return res.status(400).json({ message: "Service is currently not available" });
        }

        // Get today's date for token tracking
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get current waiting tokens for today at this specific branch
        const waitingTokens = await Token.countDocuments({
            status: "waiting",
            tokenDate: today,
            city: city || null,
            serviceCenter: serviceCenter || null
        });

        console.log('Generating token number...');
        // Generate token number based on service category, city, and branch
        const tokenNumber = await generateTokenNumber(service.category, city, serviceCenter);
        console.log('Generated token number:', tokenNumber);

        const position = waitingTokens + 1;

        // Calculate estimated wait time using improved formula
        // Formula: ceil(TokensAhead / ActiveCounters) × AvgServiceTime
        const estimatedWaitTime = await calculateEstimatedWaitTime(
            waitingTokens,      // tokens ahead in queue
            city,               // city for center-specific calculation
            serviceCenter,      // service center name
            service.avgTime     // fallback avg time from service definition
        );

        // Get settings to check for test mode
        const settings = await getSettings();
        const isTestMode = settings.testModeEnabled || false;

        // Location validation: Check if user can reach within allowed time
        // Formula: travelTime <= max(queueWaitTime, MIN_TRAVEL_TIME) + BUFFER_TIME
        // Skip validation in test mode - but still log the info
        let locationValidationSkipped = false;
        if (estimatedTravelTime !== null) {
            const baseTime = Math.max(estimatedWaitTime, MIN_TRAVEL_TIME_MINUTES);
            const maxAllowedTravelTime = baseTime + BUFFER_TIME_MINUTES;
            console.log(`Location validation: Travel time ${estimatedTravelTime} min, Queue wait ${estimatedWaitTime} min, Base time ${baseTime} min, Max allowed ${maxAllowedTravelTime} min, Test mode: ${isTestMode}`);

            if (estimatedTravelTime > maxAllowedTravelTime) {
                if (isTestMode) {
                    // In test mode, skip validation but mark it
                    locationValidationSkipped = true;
                    console.log(`TEST MODE: Location validation skipped. User is ${estimatedTravelTime - maxAllowedTravelTime} min too far.`);
                } else {
                    return res.status(400).json({
                        message: `You are too far from the center. Your travel time (${estimatedTravelTime} min) exceeds the maximum allowed (${maxAllowedTravelTime} min).`,
                        distanceToCenter,
                        estimatedTravelTime,
                        estimatedWaitTime,
                        maxAllowedTravelTime,
                        canBook: false
                    });
                }
            }
        }

        const newToken = new Token({
            tokenNumber,
            tokenDate: today,
            customer: customerId,
            service: service._id,
            serviceName: service.name,
            serviceCenter: serviceCenter || null,
            city: city || null,
            status: "waiting",
            priority: priority || "normal",
            position,
            estimatedWaitTime,
            // Location data
            userLocation: userLocation || { lat: null, lng: null },
            centerLocation: centerLocation || { lat: null, lng: null },
            distanceToCenter,
            estimatedTravelTime
        });

        console.log('Saving token...');
        await newToken.save();
        console.log('Token saved successfully');

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
                createdAt: newToken.createdAt,
                distanceToCenter: newToken.distanceToCenter,
                estimatedTravelTime: newToken.estimatedTravelTime
            },
            testMode: isTestMode,
            locationValidationSkipped
        });

    } catch (error) {
        console.error('Book token error:', error);
        next(error);
    }
};

/* ===================== GET QUEUE STATUS ===================== */
const getQueueStatus = async (req, res, next) => {
    try {
        const { service, city, serviceCenter, status } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Build query with optional filters - use tokenDate for daily queries
        const query = {
            tokenDate: today
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
                hasArrived: t.hasArrived || false,
                arrivedAt: t.arrivedAt,
                expireAt: t.expireAt,
                distanceToCenter: t.distanceToCenter,
                estimatedTravelTime: t.estimatedTravelTime,
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
                counter: t.counter,
                hasArrived: t.hasArrived || false,
                arrivedAt: t.arrivedAt,
                expireAt: t.expireAt,
                calledAt: t.calledAt
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
        const now = new Date();
        nextToken.status = "serving";
        nextToken.counter = counter._id;
        nextToken.calledAt = now;
        nextToken.serviceStartTime = now;
        // Set expireAt to 5 minutes from now (auto-cancel if not arrived)
        nextToken.expireAt = new Date(now.getTime() + ARRIVAL_WINDOW_MINUTES * 60 * 1000);
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

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const todayTokens = await Token.find({ tokenDate: today });
        const yesterdayTokens = await Token.find({ tokenDate: yesterday });

        const completed = todayTokens.filter(t => t.status === 'completed');
        const avgWaitTime = completed.length > 0
            ? Math.round(completed.reduce((sum, t) => sum + (t.actualWaitTime || 0), 0) / completed.length)
            : 0;

        const totalChange = yesterdayTokens.length > 0
            ? Math.round(((todayTokens.length - yesterdayTokens.length) / yesterdayTokens.length) * 100)
            : 0;

        const stats = {
            totalTokens: todayTokens.length,
            totalToday: todayTokens.length,
            totalChange,
            waiting: todayTokens.filter(t => t.status === 'waiting').length,
            serving: todayTokens.filter(t => t.status === 'serving').length,
            completed: completed.length,
            noShows: todayTokens.filter(t => t.status === 'no-show').length,
            avgWaitTime,
            efficiency: todayTokens.length > 0
                ? Math.round((completed.length / todayTokens.length) * 100)
                : 0
        };

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

/* ===================== GET ANALYTICS DATA ===================== */
const getAnalytics = async (req, res, next) => {
    try {
        const { range = 'today' } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let startDate = new Date(today);
        let endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);

        switch (range) {
            case 'yesterday':
                startDate.setDate(startDate.getDate() - 1);
                endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
        }

        const tokens = await Token.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).populate('service', 'name category');

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);

        const yesterdayTokens = await Token.find({
            createdAt: { $gte: yesterday, $lte: yesterdayEnd }
        });

        const completed = tokens.filter(t => t.status === 'completed');
        const noShows = tokens.filter(t => t.status === 'no-show');
        const yesterdayCompleted = yesterdayTokens.filter(t => t.status === 'completed');

        const avgWaitTime = completed.length > 0
            ? Math.round(completed.reduce((sum, t) => sum + (t.actualWaitTime || 0), 0) / completed.length)
            : 0;

        const yesterdayAvgWait = yesterdayCompleted.length > 0
            ? Math.round(yesterdayCompleted.reduce((sum, t) => sum + (t.actualWaitTime || 0), 0) / yesterdayCompleted.length)
            : 0;

        // Hourly distribution
        const hourlyData = [];
        for (let hour = 9; hour <= 17; hour++) {
            const hourTokens = tokens.filter(t => new Date(t.createdAt).getHours() === hour);
            const hourCompleted = hourTokens.filter(t => t.status === 'completed');
            hourlyData.push({
                hour: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'PM' : 'AM'}`,
                tokens: hourTokens.length,
                avgWait: hourCompleted.length > 0
                    ? Math.round(hourCompleted.reduce((s, t) => s + (t.actualWaitTime || 0), 0) / hourCompleted.length)
                    : 0
            });
        }

        // Weekly data
        const weeklyData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
            const day = new Date(today);
            day.setDate(day.getDate() - i);
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);

            const dayTokens = await Token.find({ createdAt: { $gte: dayStart, $lte: dayEnd } });
            weeklyData.push({
                day: days[day.getDay()],
                tokens: dayTokens.length,
                completed: dayTokens.filter(t => t.status === 'completed').length,
                noShow: dayTokens.filter(t => t.status === 'no-show').length
            });
        }

        // Service distribution
        const serviceMap = {};
        tokens.forEach(t => {
            const serviceName = t.serviceName || 'Other';
            serviceMap[serviceName] = (serviceMap[serviceName] || 0) + 1;
        });

        const colors = ['#01411C', '#006400', '#D4AF37', '#3B82F6', '#6B7280'];
        const serviceDistribution = Object.entries(serviceMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value], i) => ({
                name,
                value: tokens.length > 0 ? Math.round((value / tokens.length) * 100) : 0,
                count: value,
                color: colors[i % colors.length]
            }));

        // Wait time distribution
        const waitRanges = [
            { range: '0-10 min', min: 0, max: 10 },
            { range: '10-20 min', min: 10, max: 20 },
            { range: '20-30 min', min: 20, max: 30 },
            { range: '30-45 min', min: 30, max: 45 },
            { range: '45+ min', min: 45, max: Infinity }
        ];

        const waitTimeDistribution = waitRanges.map(r => ({
            range: r.range,
            count: completed.filter(t => (t.actualWaitTime || 0) >= r.min && (t.actualWaitTime || 0) < r.max).length
        }));

        // Service performance
        const servicePerformance = Object.entries(serviceMap).map(([service, count]) => {
            const serviceTokens = tokens.filter(t => t.serviceName === service);
            const serviceCompleted = serviceTokens.filter(t => t.status === 'completed');
            return {
                service,
                tokens: count,
                avgWait: serviceCompleted.length > 0
                    ? Math.round(serviceCompleted.reduce((s, t) => s + (t.actualWaitTime || 0), 0) / serviceCompleted.length)
                    : 0,
                avgService: 15
            };
        }).slice(0, 5);

        // Peak hour
        let peakHour = { hour: '12PM', tokens: 0 };
        hourlyData.forEach(h => {
            if (h.tokens > peakHour.tokens) peakHour = { hour: h.hour, tokens: h.tokens };
        });

        const totalChange = yesterdayTokens.length > 0
            ? Math.round(((tokens.length - yesterdayTokens.length) / yesterdayTokens.length) * 100)
            : 0;

        const waitChange = yesterdayAvgWait > 0
            ? Math.round(((avgWaitTime - yesterdayAvgWait) / yesterdayAvgWait) * 100)
            : 0;

        const noShowRate = tokens.length > 0
            ? Math.round((noShows.length / tokens.length) * 100 * 10) / 10
            : 0;

        const completionRate = tokens.length > 0
            ? Math.round((completed.length / tokens.length) * 100 * 10) / 10
            : 0;

        res.json({
            stats: {
                totalTokens: tokens.length,
                totalChange,
                avgWaitTime,
                waitChange,
                peakHour: peakHour.hour,
                noShowRate,
                noShowChange: 0,
                completionRate
            },
            hourlyData,
            weeklyData,
            serviceDistribution,
            waitTimeDistribution,
            servicePerformance,
            peakHourInsight: { hour: peakHour.hour, tokens: peakHour.tokens }
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== GET QUEUE COUNTS BY CENTER ===================== */
/**
 * Returns queue counts and estimated wait times for all centers.
 *
 * Uses the improved formula for wait time:
 * Wait = ceil(QueueCount / ActiveCounters) × AvgServiceTime
 *
 * This provides accurate wait time estimates for display on the admin dashboard.
 */
const getQueueCountsByCenter = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get all waiting tokens for today grouped by city and serviceCenter
        const queueCounts = await Token.aggregate([
            {
                $match: {
                    tokenDate: today,
                    status: "waiting"
                }
            },
            {
                $group: {
                    _id: {
                        city: "$city",
                        serviceCenter: "$serviceCenter"
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get active counters count for the formula
        const activeCounters = await Counter.countDocuments({
            status: { $in: ['serving', 'available'] }
        });
        const countersToUse = Math.max(activeCounters, 1);

        // Get average service time from today's completed tokens
        const completedTokensToday = await Token.find({
            tokenDate: today,
            status: 'completed',
            actualWaitTime: { $gt: 0 }
        });

        let avgServiceTime = 15; // Default fallback (15 minutes)
        if (completedTokensToday.length > 0) {
            const totalServiceTime = completedTokensToday.reduce(
                (sum, token) => sum + (token.actualWaitTime || 0), 0
            );
            avgServiceTime = Math.round(totalServiceTime / completedTokensToday.length);
        }

        // Convert to a map for easy lookup with calculated wait times
        const countsMap = {};
        queueCounts.forEach(item => {
            if (item._id.city && item._id.serviceCenter) {
                const key = `${item._id.city}|${item._id.serviceCenter}`;
                const queueCount = item.count;

                // Calculate wait time using improved formula:
                // Wait = ceil(QueueCount / ActiveCounters) × AvgServiceTime
                const roundsToWait = Math.ceil(queueCount / countersToUse);
                const estimatedWaitTime = roundsToWait * avgServiceTime;

                countsMap[key] = {
                    count: queueCount,
                    avgWaitTime: estimatedWaitTime
                };
            }
        });

        res.json({
            queueCounts: countsMap,
            activeCounters: countersToUse,
            avgServiceTime,
            timestamp: new Date()
        });

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

/* ===================== MARK CUSTOMER ARRIVED ===================== */
/**
 * Marks that a customer has arrived at the counter.
 * This stops the auto-cancel timer.
 */
const markArrived = async (req, res, next) => {
    try {
        const { tokenId } = req.params;

        const token = await Token.findById(tokenId);
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        if (token.status !== "serving") {
            return res.status(400).json({ message: "Token is not currently being served" });
        }

        if (token.hasArrived) {
            return res.status(400).json({ message: "Customer has already arrived" });
        }

        token.hasArrived = true;
        token.arrivedAt = new Date();
        token.expireAt = null; // Clear expiration since customer arrived
        await token.save();

        res.json({
            message: "Customer marked as arrived",
            token: {
                _id: token._id,
                tokenNumber: token.tokenNumber,
                hasArrived: token.hasArrived,
                arrivedAt: token.arrivedAt
            }
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== CHECK AND CANCEL EXPIRED TOKENS ===================== */
/**
 * Checks for tokens that have expired (5 min after being called without arrival)
 * and automatically cancels them.
 * This should be called periodically or before calling next token.
 */
const checkExpiredTokens = async (req, res, next) => {
    try {
        const now = new Date();

        // Find tokens that are serving, not arrived, and past expiration
        const expiredTokens = await Token.find({
            status: "serving",
            hasArrived: false,
            expireAt: { $lte: now }
        }).populate('customer', 'fullName phoneNumber');

        const cancelledTokens = [];

        for (const token of expiredTokens) {
            // Cancel the token
            token.status = "cancelled";
            token.cancellationReason = "auto_expired";
            token.completedAt = now;
            await token.save();

            // Free up the counter
            if (token.counter) {
                const counter = await Counter.findById(token.counter);
                if (counter) {
                    counter.status = "available";
                    counter.currentToken = null;
                    await counter.save();
                }
            }

            // Update positions
            await Token.updateMany(
                { status: "waiting", position: { $gt: token.position } },
                { $inc: { position: -1 } }
            );

            cancelledTokens.push({
                tokenNumber: token.tokenNumber,
                customerName: token.customer?.fullName || 'Customer',
                customerPhone: token.customer?.phoneNumber || '',
                calledAt: token.calledAt,
                expiredAt: now
            });

            console.log(`Token ${token.tokenNumber} auto-cancelled due to no arrival within 5 minutes`);
        }

        res.json({
            message: `${cancelledTokens.length} token(s) auto-cancelled`,
            cancelledTokens
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== GET TOKEN STATUS WITH EXPIRY INFO ===================== */
/**
 * Gets detailed token status including expiry countdown for serving tokens.
 */
const getTokenStatus = async (req, res, next) => {
    try {
        const { tokenId } = req.params;

        const token = await Token.findById(tokenId)
            .populate('customer', 'fullName phoneNumber')
            .populate('counter', 'name');

        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        let timeRemaining = null;
        if (token.status === "serving" && !token.hasArrived && token.expireAt) {
            const now = new Date();
            timeRemaining = Math.max(0, Math.floor((token.expireAt - now) / 1000)); // seconds remaining
        }

        res.json({
            token: {
                _id: token._id,
                tokenNumber: token.tokenNumber,
                status: token.status,
                hasArrived: token.hasArrived,
                arrivedAt: token.arrivedAt,
                calledAt: token.calledAt,
                expireAt: token.expireAt,
                timeRemaining, // seconds until auto-cancel
                customerName: token.customer?.fullName || 'Customer',
                customerPhone: token.customer?.phoneNumber || '',
                counterName: token.counter?.name || null,
                distanceToCenter: token.distanceToCenter,
                estimatedTravelTime: token.estimatedTravelTime
            }
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== CALCULATE DISTANCE TO CENTER ===================== */
/**
 * Calculate distance and travel time from user location to service center
 * Uses Google Maps Distance Matrix API for accurate results
 */
const calculateDistanceToCenter = async (req, res, next) => {
    try {
        const { userLocation, centerLocation } = req.body;

        if (!userLocation || !centerLocation) {
            return res.status(400).json({
                message: "Both userLocation and centerLocation are required"
            });
        }

        if (!userLocation.lat || !userLocation.lng || !centerLocation.lat || !centerLocation.lng) {
            return res.status(400).json({
                message: "Invalid coordinates. Both lat and lng are required for each location"
            });
        }

        // Use Google Maps API for accurate distance and travel time
        const distanceResult = await getDistanceAndDuration(
            { lat: userLocation.lat, lng: userLocation.lng },
            { lat: centerLocation.lat, lng: centerLocation.lng }
        );

        res.json({
            success: true,
            source: distanceResult.source, // 'google_maps' or 'fallback'
            distance: {
                km: distanceResult.distance.km,
                text: distanceResult.distance.text
            },
            duration: {
                minutes: distanceResult.duration.minutes,
                text: distanceResult.duration.text
            },
            isGoogleMapsConfigured: isGoogleMapsConfigured()
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
    getAnalytics,
    getQueueCountsByCenter,
    cancelToken,
    markArrived,
    checkExpiredTokens,
    getTokenStatus,
    calculateDistanceToCenter
};
