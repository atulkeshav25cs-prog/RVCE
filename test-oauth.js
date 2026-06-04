const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    console.log("Navigating to http://localhost:3000/citizen/login...");
    await page.goto('http://localhost:3000/citizen/login', { waitUntil: 'networkidle0' });
    
    console.log("Waiting for Login with Google button...");
    await page.waitForSelector('button:has-text("Login with Google")', { timeout: 10000 });
    
    console.log("Clicking button...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const googleBtn = btns.find(b => b.textContent.includes('Login with Google'));
      if (googleBtn) googleBtn.click();
    });
    
    console.log("Waiting for #oauth-debug-output or redirect...");
    try {
      await page.waitForSelector('.whitespace-pre-wrap', { timeout: 10000 });
      const text = await page.$eval('.whitespace-pre-wrap', el => el.innerText);
      console.log("\n\n=== OAUTH RESULT JSON ===");
      console.log(text);
      console.log("=========================\n\n");
    } catch (e) {
      console.log("No debug output found. Did it redirect?");
      console.log("Current URL:", page.url());
    }

    await browser.close();
  } catch (err) {
    console.error("Puppeteer Error:", err);
  }
})();
