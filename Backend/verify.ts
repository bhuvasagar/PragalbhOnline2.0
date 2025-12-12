const BASE_URL = "http://127.0.0.1:5000/api";

async function verify() {
  console.log("Starting verification...");

  // 1. Root Check
  try {
    const res = await fetch("http://127.0.0.1:5000");
    const text = await res.text();
    console.log(`[PASS] Root: ${text}`);
  } catch (e) {
    console.error(`[FAIL] Root: ${e}`);
  }

  // 2. Login
  let token = "";
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@pragalbh.com",
        password: "adminpassword123",
      }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      token = data.token;
      console.log(`[PASS] Login: Token received`);
    } else {
      console.error(`[FAIL] Login: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    console.error(`[FAIL] Login: ${e}`);
  }

  // 3. Get Services
  try {
    const res = await fetch(`${BASE_URL}/services`);
    const data = await res.json();
    if (res.ok && Array.isArray(data) && data.length > 0) {
      console.log(`[PASS] Get Services: Found ${data.length} services`);
    } else {
      console.error(`[FAIL] Get Services: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    console.error(`[FAIL] Get Services: ${e}`);
  }

  // 4. Submit Application
  try {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Test User",
        phone: "9999999999",
        serviceId: "ews-reservation-cert", // ID from seed
        serviceName: "10% EWS Certificate",
        message: "Need help asap",
      }),
    });
    const data = await res.json();
    if (res.ok && data.customerName === "Test User") {
      console.log(`[PASS] Submit Application: Success`);
    } else {
      console.error(`[FAIL] Submit Application: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    console.error(`[FAIL] Submit Application: ${e}`);
  }

  // 5. Get Applications (Protected)
  if (token) {
    try {
      const res = await fetch(`${BASE_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        console.log(
          `[PASS] Get Applications (Admin): Found ${data.length} apps`
        );
      } else {
        console.error(`[FAIL] Get Applications: ${JSON.stringify(data)}`);
      }
    } catch (e) {
      console.error(`[FAIL] Get Applications: ${e}`);
    }
  } else {
    console.log("[SKIP] Get Applications: No token");
  }

  // 6. Get Testimonials
  try {
    const res = await fetch(`${BASE_URL}/testimonials`);
    const data = await res.json();
    if (res.ok && Array.isArray(data) && data.length > 0) {
      console.log(`[PASS] Get Testimonials: Found ${data.length} testimonials`);
    } else {
      console.error(`[FAIL] Get Testimonials: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    console.error(`[FAIL] Get Testimonials: ${e}`);
  }
}

verify();
