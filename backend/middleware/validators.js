/**
 * Input Validation Middleware
 * Validates user inputs for security and data integrity
 */

// Validation patterns
const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // Pakistani CNIC format: 12345-1234567-1
    cnic: /^\d{5}-\d{7}-\d{1}$/,
    // Pakistani phone: 03001234567 or +923001234567
    phone: /^(03\d{9}|\+923\d{9})$/,
    // Password: min 8 chars, at least 1 letter and 1 number
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
};

// Validation error messages
const messages = {
    email: "Invalid email format",
    cnic: "Invalid CNIC format. Use: 12345-1234567-1",
    phone: "Invalid phone number. Use: 03001234567 or +923001234567",
    password: "Password must be at least 8 characters with letters and numbers",
    fullName: "Full name must be 2-50 characters",
    required: (field) => `${field} is required`
};

/**
 * Validate signup request body
 */
const validateSignup = (req, res, next) => {
    const { fullName, phoneNumber, cnic, email, password } = req.body;
    const errors = [];

    // Required fields check
    if (!fullName?.trim()) errors.push(messages.required("Full name"));
    if (!phoneNumber?.trim()) errors.push(messages.required("Phone number"));
    if (!cnic?.trim()) errors.push(messages.required("CNIC"));
    if (!email?.trim()) errors.push(messages.required("Email"));
    if (!password) errors.push(messages.required("Password"));

    // If required fields missing, return early
    if (errors.length > 0) {
        return res.status(400).json({ message: errors[0], errors });
    }

    // Full name validation (2-50 chars, letters and spaces only)
    if (fullName.trim().length < 2 || fullName.trim().length > 50) {
        errors.push(messages.fullName);
    }

    // Email format validation
    if (!patterns.email.test(email.toLowerCase().trim())) {
        errors.push(messages.email);
    }

    // CNIC format validation
    if (!patterns.cnic.test(cnic.trim())) {
        errors.push(messages.cnic);
    }

    // Phone number validation
    if (!patterns.phone.test(phoneNumber.trim().replace(/\s/g, ''))) {
        errors.push(messages.phone);
    }

    // Password strength validation
    if (!patterns.password.test(password)) {
        errors.push(messages.password);
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors[0], errors });
    }

    // Sanitize inputs
    req.body.fullName = fullName.trim();
    req.body.email = email.toLowerCase().trim();
    req.body.phoneNumber = phoneNumber.trim().replace(/\s/g, '');
    req.body.cnic = cnic.trim();

    next();
};

/**
 * Validate login request body
 */
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email?.trim()) errors.push(messages.required("Email"));
    if (!password) errors.push(messages.required("Password"));

    if (errors.length > 0) {
        return res.status(400).json({ message: errors[0], errors });
    }

    if (!patterns.email.test(email.toLowerCase().trim())) {
        errors.push(messages.email);
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors[0], errors });
    }

    // Sanitize
    req.body.email = email.toLowerCase().trim();

    next();
};

/**
 * Validate token booking request
 */
const validateTokenBooking = (req, res, next) => {
    const { serviceId, priority } = req.body;
    const errors = [];

    if (!serviceId) {
        errors.push(messages.required("Service"));
    }

    // Validate priority if provided
    const validPriorities = ['normal', 'senior', 'disabled', 'vip'];
    if (priority && !validPriorities.includes(priority)) {
        errors.push("Invalid priority. Must be: normal, senior, disabled, or vip");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors[0], errors });
    }

    // Default priority if not provided
    if (!priority) {
        req.body.priority = 'normal';
    }

    next();
};

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;

        if (!id || !objectIdPattern.test(id)) {
            return res.status(400).json({
                message: `Invalid ${paramName} format`
            });
        }

        next();
    };
};

/**
 * Sanitize string inputs to prevent XSS
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
};

/**
 * General sanitization middleware
 */
const sanitizeBody = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeString(req.body[key]);
            }
        });
    }
    next();
};

module.exports = {
    validateSignup,
    validateLogin,
    validateTokenBooking,
    validateObjectId,
    sanitizeBody,
    patterns,
    messages
};
