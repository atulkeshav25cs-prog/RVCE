async function runTests() {
  console.log("Testing GET /api/analytics/overview (No Auth)");
  let res1 = await fetch("http://localhost:3000/api/analytics/overview");
  console.log("Analytics Overview Status:", res1.status); // Expect 401

  console.log("Testing GET /api/analytics/incidents (No Auth)");
  let res2 = await fetch("http://localhost:3000/api/analytics/incidents");
  console.log("Analytics Incidents Status:", res2.status); // Expect 401

  console.log("Testing GET /api/analytics/resources (No Auth)");
  let res3 = await fetch("http://localhost:3000/api/analytics/resources");
  console.log("Analytics Resources Status:", res3.status); // Expect 401

  console.log("Testing GET /api/analytics/timeline (No Auth)");
  let res4 = await fetch("http://localhost:3000/api/analytics/timeline");
  console.log("Analytics Timeline Status:", res4.status); // Expect 401
}

runTests();
