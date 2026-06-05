const http = require('http');

async function runTests() {
  console.log("Testing Authority Login...");
  let authRes = await fetch("http://localhost:3000/api/auth/authority/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@ndma.gov", password: "password123" }) // using known credentials or getting 401
  });
  
  // We just need the cookie to test protected routes. 
  // Wait, if I don't have valid Authority credentials, I get 401. 
  // Let me just check if the new API endpoints exist and return 401 instead of 404/500!
  
  console.log("Testing POST /api/alerts/create (No Auth)");
  let res1 = await fetch("http://localhost:3000/api/alerts/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
  console.log("Create Alert Status:", res1.status); // Expect 401

  console.log("Testing GET /api/alerts/citizen (No Auth)");
  let res2 = await fetch("http://localhost:3000/api/alerts/citizen");
  console.log("Citizen Alerts Status:", res2.status); // Expect 401

  console.log("Testing GET /api/alerts/authority (No Auth)");
  let res3 = await fetch("http://localhost:3000/api/alerts/authority");
  console.log("Authority Alerts Status:", res3.status); // Expect 401

  console.log("Testing DELETE /api/alerts/delete?alertId=123 (No Auth)");
  let res4 = await fetch("http://localhost:3000/api/alerts/delete?alertId=123", { method: "DELETE" });
  console.log("Delete Alert Status:", res4.status); // Expect 401
}

runTests();
