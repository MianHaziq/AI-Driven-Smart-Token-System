const Service = require("../models/service");

/* ===================== CREATE SERVICE ===================== */
const createService = async (req, res, next) => {
    try {
        const { name, nameUrdu, category, avgTime, fee, isActive, description } = req.body;

        if (!name || !category) {
            return res.status(400).json({ message: "Name and category are required" });
        }

        const newService = new Service({
            name,
            nameUrdu: nameUrdu || "",
            category,
            avgTime: avgTime || 15,
            fee: fee || 0,
            isActive: isActive !== undefined ? isActive : true,
            description: description || ""
        });

        await newService.save();

        res.status(201).json({
            message: "Service created successfully",
            service: newService
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== READ ALL SERVICES ===================== */
const readServices = async (req, res, next) => {
    try {
        const { category, isActive } = req.query;

        let filter = {};
        if (category && category !== 'all') {
            filter.category = category;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const services = await Service.find(filter).sort({ createdAt: -1 });
        res.json(services);
    } catch (error) {
        next(error);
    }
};

/* ===================== READ SERVICE BY ID ===================== */
const readServiceById = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json(service);
    } catch (error) {
        next(error);
    }
};

/* ===================== UPDATE SERVICE ===================== */
const updateService = async (req, res, next) => {
    try {
        const { name, nameUrdu, category, avgTime, fee, isActive, description } = req.body;

        let updatedData = {};

        if (name) updatedData.name = name;
        if (nameUrdu !== undefined) updatedData.nameUrdu = nameUrdu;
        if (category) updatedData.category = category;
        if (avgTime !== undefined) updatedData.avgTime = avgTime;
        if (fee !== undefined) updatedData.fee = fee;
        if (isActive !== undefined) updatedData.isActive = isActive;
        if (description !== undefined) updatedData.description = description;

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json({
            message: "Service updated successfully",
            service: updatedService
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== DELETE SERVICE ===================== */
const deleteService = async (req, res, next) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json({ message: "Service deleted successfully" });
    } catch (error) {
        next(error);
    }
};

/* ===================== TOGGLE SERVICE STATUS ===================== */
const toggleServiceStatus = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        service.isActive = !service.isActive;
        await service.save();

        res.json({
            message: `Service ${service.isActive ? 'enabled' : 'disabled'} successfully`,
            service
        });

    } catch (error) {
        next(error);
    }
};

/* ===================== GET SERVICE STATS ===================== */
const getServiceStats = async (req, res, next) => {
    try {
        const services = await Service.find();

        const stats = {
            totalServices: services.length,
            activeServices: services.filter(s => s.isActive).length,
            totalTokensToday: services.reduce((sum, s) => sum + s.tokensToday, 0)
        };

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createService,
    readServices,
    readServiceById,
    updateService,
    deleteService,
    toggleServiceStatus,
    getServiceStats
};
