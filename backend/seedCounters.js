const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const Counter = require("./models/counter");

const counters = [
    {
        name: "Counter 1",
        status: "available",
        services: ["nadra", "passport"],
        tokensServed: 0,
        avgServiceTime: 0
    },
    {
        name: "Counter 2",
        status: "available",
        services: ["nadra", "passport", "excise"],
        tokensServed: 0,
        avgServiceTime: 0
    },
    {
        name: "Counter 3",
        status: "available",
        services: ["banks", "utilities"],
        tokensServed: 0,
        avgServiceTime: 0
    },
    {
        name: "Counter 4",
        status: "available",
        services: ["nadra", "banks"],
        tokensServed: 0,
        avgServiceTime: 0
    },
    {
        name: "Counter 5",
        status: "offline",
        services: ["passport", "excise"],
        tokensServed: 0,
        avgServiceTime: 0
    },
];

const seedCounters = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB");

        // Clear existing counters
        await Counter.deleteMany({});
        console.log("Cleared existing counters");

        // Insert new counters
        const result = await Counter.insertMany(counters);
        console.log(`Inserted ${result.length} counters successfully`);

        console.log("\nCounters seeded:");
        result.forEach(c => console.log(`  - ${c.name} (${c.status})`));

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding counters:", error);
        process.exit(1);
    }
};

seedCounters();
