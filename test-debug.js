const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
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
  await page.waitForTimeout(3000);
  const error = await page.$('.text-red-400');
  if (error) {
    console.log('UI ERROR:', await error.innerText());
  } else {
    console.log('No UI error found. Current page text length:', (await page.innerText('body')).length);
    await page.screenshot({ path: 'debug-screenshot.png' });
  }
  await browser.close();
})();
