const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const tokensCollection = db.collection('tokens');

        // Get current indexes
        const indexes = await tokensCollection.indexes();
        console.log("\nCurrent indexes on tokens collection:");
        indexes.forEach(idx => {
            console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
        });

        // Drop the old tokenNumber_1 unique index if it exists
        const oldIndex = indexes.find(idx => idx.name === 'tokenNumber_1');
        if (oldIndex) {
            console.log("\nDropping old 'tokenNumber_1' index...");
            await tokensCollection.dropIndex('tokenNumber_1');
            console.log("Old index dropped successfully!");
        } else {
            console.log("\nNo 'tokenNumber_1' index found.");
        }

        // Clear old tokens (optional - to start fresh)
        const tokenCount = await tokensCollection.countDocuments();
        if (tokenCount > 0) {
            console.log(`\nClearing ${tokenCount} old tokens...`);
            await tokensCollection.deleteMany({});
            console.log("Old tokens cleared!");
        }

        // Also reset the settings counter
        const settingsCollection = db.collection('settings');
        await settingsCollection.updateMany({}, {
            $set: {
                dailyTokenCounter: 0,
                lastTokenDate: null
            }
        });
        console.log("Settings counter reset!");

        // Get updated indexes
        const newIndexes = await tokensCollection.indexes();
        console.log("\nUpdated indexes:");
        newIndexes.forEach(idx => {
            console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
        });

        console.log("\n✅ Indexes fixed successfully!");
        console.log("You can now book tokens without issues.");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error fixing indexes:", error);
        process.exit(1);
    }
};

fixIndexes();
