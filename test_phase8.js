const http = require('http');

async function runTests() {
  console.log("Testing POST /api/public-records/publish (No Auth)");
  let res1 = await fetch("http://localhost:3000/api/public-records/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ incidentId: "123" }) });
  console.log("Publish Record Status:", res1.status); // Expect 401

  console.log("Testing GET /api/public-records (No Auth allowed)");
  let res2 = await fetch("http://localhost:3000/api/public-records");
  console.log("Get Public Records Status:", res2.status); // Expect 200

  console.log("Testing GET /api/public-records/eligible (No Auth)");
  let res3 = await fetch("http://localhost:3000/api/public-records/eligible");
  console.log("Get Eligible Records Status:", res3.status); // Expect 401

  console.log("Testing DELETE /api/public-records/delete?recordId=123 (No Auth)");
  let res4 = await fetch("http://localhost:3000/api/public-records/delete?recordId=123", { method: "DELETE" });
  console.log("Delete Record Status:", res4.status); // Expect 401
}

runTests();
