const mongoose = require("mongoose");
const path = require("path");

// require dotenv to load .env.local
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const CitizenSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    trustedContacts: [{
      name: String,
      email: String,
      phone: String
    }]
  }, { collection: "citizens" });
  
  const citizens = await mongoose.connection.db.collection("citizens").find({}).toArray();
  console.log("RAW CITIZENS IN DB:");
  citizens.forEach(c => {
    console.log(`- ${c.fullName} (${c.email})`);
    console.log(`  trustedContacts:`, c.trustedContacts);
  });
  
  process.exit(0);
}

check().catch(console.error);
