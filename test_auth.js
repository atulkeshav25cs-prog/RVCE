fetch("http://localhost:3000/api/auth/authority/login", { 
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@example.com", password: "password" })
})
.then(async res => {
  console.log("STATUS:", res.status);
  console.log("HEADERS:", Array.from(res.headers.entries()));
  const text = await res.text();
  console.log("BODY START:", text.substring(0, 100));
})
.catch(console.error);
