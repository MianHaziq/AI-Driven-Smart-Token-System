const mongoose = require("mongoose");

// Service category prefixes
const CATEGORY_PREFIXES = {
    'nadra': 'N',
    'passport': 'P',
    'excise': 'E',
    'electricity': 'L',
    'sui-gas': 'G',
    'banks': 'B',
    'utilities': 'U'
};

const tokenCounterSchema = new mongoose.Schema(
    {
        // Unique identifier: category + city + serviceCenter
        category: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        serviceCenter: {
            type: String,
            required: true
        },
        // Branch code assigned to this center (A, B, C, etc.)
        branchCode: {
            type: String,
            required: true,
            maxlength: 1
        },
        // Current counter for today
        currentNumber: {
            type: Number,
            default: 0
        },
        // Date for which this counter is valid
        counterDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Compound unique index for category + city + serviceCenter + date
tokenCounterSchema.index(
    { category: 1, city: 1, serviceCenter: 1, counterDate: 1 },
    { unique: true }
);

// Static method to get category prefix
tokenCounterSchema.statics.getCategoryPrefix = function(category) {
    return CATEGORY_PREFIXES[category?.toLowerCase()] || 'X';
};

// Static method to generate next token number for a specific branch
tokenCounterSchema.statics.getNextTokenNumber = async function(category, city, serviceCenter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const categoryLower = category?.toLowerCase() || 'other';
    const prefix = this.getCategoryPrefix(categoryLower);

    // Find or create counter for this branch
    let counter = await this.findOne({
        category: categoryLower,
        city: city,
        serviceCenter: serviceCenter,
        counterDate: today
    });

    if (!counter) {
        // Need to assign a branch code for this center
        // Find all existing branch codes for this category + city today
        const existingCounters = await this.find({
            category: categoryLower,
            city: city,
            counterDate: today
        }).sort({ branchCode: 1 });

        // Assign next available branch code (A, B, C, etc.)
        let branchCode = 'A';
        if (existingCounters.length > 0) {
            // Get existing branch codes
            const usedCodes = existingCounters.map(c => c.branchCode);

            // Find next available code
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let i = 0; i < alphabet.length; i++) {
                if (!usedCodes.includes(alphabet[i])) {
                    branchCode = alphabet[i];
                    break;
                }
            }
        }

        // Create new counter for this branch
        counter = new this({
            category: categoryLower,
            city: city,
            serviceCenter: serviceCenter,
            branchCode: branchCode,
            currentNumber: 0,
            counterDate: today
        });
    }

    // Increment counter
    counter.currentNumber += 1;
    await counter.save();

    // Generate token number: CategoryPrefix + BranchCode + Number (3 digits)
    const tokenNumber = `${prefix}${counter.branchCode}${counter.currentNumber.toString().padStart(3, '0')}`;

    return tokenNumber;
};

const TokenCounter = mongoose.model("tokenCounter", tokenCounterSchema);
module.exports = TokenCounter;
