/**
 * Admin Role Authorization Middleware
 * Use after the authorization middleware to restrict routes to admin users only
 * Allows both 'admin' and 'superadmin' roles
 */
const isAdmin = (req, res, next) => {
    // Check if user exists (should be set by authorization middleware)
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    // Check if user has admin or superadmin role
    const adminRoles = ['admin', 'superadmin'];
    if (!adminRoles.includes(req.user.role)) {
        return res.status(403).json({
            message: "Access denied. Admin privileges required."
        });
    }

    next();
};

module.exports = isAdmin;
