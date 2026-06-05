const http = require('http');

async function runTests() {
  console.log("Testing GET /api/maps/incidents (No Auth)");
  let res1 = await fetch("http://localhost:3000/api/maps/incidents");
  console.log("Maps Incidents Status:", res1.status); // Expect 401

  console.log("Testing GET /api/maps/resources (No Auth)");
  let res2 = await fetch("http://localhost:3000/api/maps/resources");
  console.log("Maps Resources Status:", res2.status); // Expect 401

  console.log("Testing GET /api/maps/citizen (No Auth)");
  let res3 = await fetch("http://localhost:3000/api/maps/citizen");
  console.log("Maps Citizen Status:", res3.status); // Expect 401
}

runTests();
