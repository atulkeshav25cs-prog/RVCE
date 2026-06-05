fetch("http://localhost:3000/api/auth/citizen/login", { 
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@example.com", password: "password" })
})
.then(async res => {
  console.log("STATUS:", res.status);
  console.log("BODY:", await res.text());
})
.catch(console.error);
