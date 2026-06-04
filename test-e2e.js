const { chromium } = require('@playwright/test');

async function testCitizenSignup(browser) {
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  console.log("Testing Citizen Signup...");
  await page.goto('http://localhost:3000/citizen/signup');
  await page.waitForLoadState('networkidle');

  await page.fill('input[name="fullName"]', 'Test Citizen');
  await page.fill('input[name="emailAddress"]', 'citizen+clerk_test@example.com');
  await page.fill('input[name="phone"]', '9876543210');
  await page.selectOption('select[name="gender"]', 'other');
  await page.fill('input[name="age"]', '25');
  await page.fill('input[name="trustedContacts.0.name"]', 'Emergency Contact');
  await page.fill('input[name="trustedContacts.0.phone"]', '9876543211');

  await page.click('button[type="submit"]:has-text("Verify Identity & Register")');
  
  // Wait for the OTP input to appear
  try {
    await page.waitForSelector('text=Enter Verification Code', { timeout: 10000 });
    console.log("✅ Citizen Signup OTP step reached successfully!");
    
    // Try to enter OTP (Clerk test mode uses 424242)
    const otpInput = await page.$('input[placeholder="------"]');
    if (otpInput) {
      await otpInput.fill('424242');
      await page.click('button[type="submit"]:has-text("Confirm Security Code")');
      await page.waitForURL('**/citizen/onboarding', { timeout: 10000 });
      console.log("✅ Citizen Signup OTP verification succeeded!");
    }
  } catch (err) {
    console.error("❌ Citizen Signup failed:", err.message);
    await page.screenshot({ path: 'citizen-signup-error.png' });
  }
  await page.close();
}

async function testAuthoritySignup(browser) {
  const page = await browser.newPage();
  console.log("Testing Authority Signup...");
  await page.goto('http://localhost:3000/authority/signup');
  await page.waitForLoadState('networkidle');

  await page.fill('input[name="inviteCode"]', 'NATIONAL-AUTHORITY-01');
  await page.fill('input[name="fullName"]', 'Test Authority');
  await page.fill('input[name="emailAddress"]', 'authority+clerk_test@example.com');
  await page.fill('input[name="phone"]', '9876543212');
  await page.fill('input[name="departmentName"]', 'Metro Police');
  await page.fill('input[name="authorityId"]', 'AUTH-1234');

  await page.click('button[type="submit"]:has-text("Verify Clearance & Register")');
  
  try {
    await page.waitForSelector('text=Security Clearance Code', { timeout: 10000 });
    console.log("✅ Authority Signup OTP step reached successfully!");
    
    const otpInput = await page.$('input[placeholder="------"]');
    if (otpInput) {
      await otpInput.fill('424242');
      await page.click('button[type="submit"]:has-text("Confirm Clearance")');
      await page.waitForURL('**/authority/onboarding', { timeout: 10000 });
      console.log("✅ Authority Signup OTP verification succeeded!");
    }
  } catch (err) {
    console.error("❌ Authority Signup failed:", err.message);
  }
  await page.close();
}

async function testCitizenLogin(browser) {
  const page = await browser.newPage();
  console.log("Testing Citizen Login...");
  await page.goto('http://localhost:3000/citizen/login');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"]', 'citizen+clerk_test@example.com');
  await page.click('button[type="submit"]:has-text("Send Access Code")');

  try {
    await page.waitForSelector('text=Security Code', { timeout: 10000 });
    console.log("✅ Citizen Login OTP step reached successfully!");
    
    const otpInput = await page.$('input[placeholder="------"]');
    if (otpInput) {
      await otpInput.fill('424242');
      await page.click('button[type="submit"]:has-text("Verify Identity")');
      await page.waitForURL('**/citizen/dashboard', { timeout: 10000 });
      console.log("✅ Citizen Login OTP verification succeeded!");
    }
  } catch (err) {
    console.error("❌ Citizen Login failed:", err.message);
  }
  await page.close();
}

async function testAuthorityLogin(browser) {
  const page = await browser.newPage();
  console.log("Testing Authority Login...");
  await page.goto('http://localhost:3000/authority/login');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"]', 'authority+clerk_test@example.com');
  await page.click('button[type="submit"]:has-text("Request Access Token")');

  try {
    await page.waitForSelector('text=Security Clearance Code', { timeout: 10000 });
    console.log("✅ Authority Login OTP step reached successfully!");
    
    const otpInput = await page.$('input[placeholder="------"]');
    if (otpInput) {
      await otpInput.fill('424242');
      await page.click('button[type="submit"]:has-text("Verify Identity")');
      await page.waitForURL('**/authority/dashboard', { timeout: 10000 });
      console.log("✅ Authority Login OTP verification succeeded!");
    }
  } catch (err) {
    console.error("❌ Authority Login failed:", err.message);
  }
  await page.close();
}

async function testOAuth(browser) {
  const page = await browser.newPage();
  console.log("Testing Google OAuth...");
  await page.goto('http://localhost:3000/citizen/signup');
  await page.waitForLoadState('networkidle');

  await page.click('button:has-text("Continue with Google")');
  
  try {
    // Check if the URL changes to accounts.google.com
    await page.waitForURL(/accounts\.google\.com/, { timeout: 10000 });
    console.log("✅ Google OAuth redirect to accounts.google.com succeeded!");
  } catch (err) {
    console.error("❌ Google OAuth redirect failed:", err.message);
  }
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  await testCitizenSignup(browser);
  await testAuthoritySignup(browser);
  await testCitizenLogin(browser);
  await testAuthorityLogin(browser);
  await testOAuth(browser);
  await browser.close();
})();
