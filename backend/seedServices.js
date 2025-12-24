const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const Service = require("./models/service");

const services = [
    // NADRA Services
    { name: "New CNIC", slug: "cnic-new", category: "nadra", avgTime: 15, fee: 400 },
    { name: "CNIC Renewal", slug: "cnic-renewal", category: "nadra", avgTime: 10, fee: 400 },
    { name: "CNIC Modification", slug: "cnic-modification", category: "nadra", avgTime: 15, fee: 500 },
    { name: "Family Registration Certificate", slug: "family-registration", category: "nadra", avgTime: 20, fee: 600 },
    { name: "NICOP Application", slug: "nicop", category: "nadra", avgTime: 20, fee: 3000 },
    { name: "Pakistan Origin Card", slug: "poc", category: "nadra", avgTime: 25, fee: 5000 },

    // Passport Services
    { name: "New Passport", slug: "passport-new", category: "passport", avgTime: 30, fee: 3500 },
    { name: "Passport Renewal", slug: "passport-renewal", category: "passport", avgTime: 25, fee: 3500 },
    { name: "Urgent Passport", slug: "passport-urgent", category: "passport", avgTime: 20, fee: 9000 },
    { name: "Lost Passport Replacement", slug: "passport-lost", category: "passport", avgTime: 30, fee: 5000 },
    { name: "Child Passport", slug: "child-passport", category: "passport", avgTime: 25, fee: 2500 },

    // Excise & Taxation Services
    { name: "Vehicle Registration", slug: "vehicle-registration", category: "excise", avgTime: 45, fee: 2000 },
    { name: "Vehicle Transfer", slug: "vehicle-transfer", category: "excise", avgTime: 40, fee: 1500 },
    { name: "New Driving License", slug: "driving-license-new", category: "excise", avgTime: 30, fee: 1200 },
    { name: "Driving License Renewal", slug: "driving-license-renewal", category: "excise", avgTime: 20, fee: 800 },
    { name: "Property Tax Payment", slug: "property-tax", category: "excise", avgTime: 15, fee: 0 },

    // Electricity Services
    { name: "New Connection", slug: "new-connection", category: "electricity", avgTime: 30, fee: 5000 },
    { name: "Meter Change Request", slug: "meter-change", category: "electricity", avgTime: 20, fee: 1000 },
    { name: "Load Extension", slug: "load-extension", category: "electricity", avgTime: 25, fee: 3000 },
    { name: "Billing Complaint", slug: "billing-complaint", category: "electricity", avgTime: 15, fee: 0 },
    { name: "Connection Transfer", slug: "connection-transfer", category: "electricity", avgTime: 20, fee: 500 },

    // Sui Gas Services
    { name: "New Gas Connection", slug: "gas-new-connection", category: "sui-gas", avgTime: 35, fee: 8000 },
    { name: "Meter Replacement", slug: "gas-meter-change", category: "sui-gas", avgTime: 20, fee: 1500 },
    { name: "Gas Leakage Complaint", slug: "gas-complaint", category: "sui-gas", avgTime: 10, fee: 0 },
    { name: "Bill Correction", slug: "gas-bill-correction", category: "sui-gas", avgTime: 15, fee: 0 },

    // Bank Services
    { name: "Account Opening", slug: "account-opening", category: "banks", avgTime: 30, fee: 0 },
    { name: "ATM/Debit Card Issuance", slug: "atm-card", category: "banks", avgTime: 15, fee: 500 },
    { name: "Cheque Book Request", slug: "cheque-book", category: "banks", avgTime: 10, fee: 300 },
    { name: "Bank Statement", slug: "bank-statement", category: "banks", avgTime: 10, fee: 200 },
    { name: "Loan Inquiry", slug: "loan-inquiry", category: "banks", avgTime: 25, fee: 0 },
];

const seedServices = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB");

        // Clear existing services
        await Service.deleteMany({});
        console.log("Cleared existing services");

        // Insert new services
        const result = await Service.insertMany(services);
        console.log(`Inserted ${result.length} services successfully`);

        console.log("\nServices seeded:");
        result.forEach(s => console.log(`  - ${s.name} (${s.slug})`));

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding services:", error);
        process.exit(1);
    }
};

seedServices();
