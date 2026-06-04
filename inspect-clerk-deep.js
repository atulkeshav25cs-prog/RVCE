const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/citizen/signup');
  await page.waitForFunction('window.__DEBUG_SIGNUP !== undefined');
  
  const result = await page.evaluate(() => {
    const signIn = window.__DEBUG_SIGNIN;
    const signUp = window.__DEBUG_SIGNUP;
    
    function getKeys(obj) {
      if (!obj) return [];
      const keys = [];
      for (const k in obj) keys.push(k);
      return keys;
    }
    
    return {
      signInEmailCode: getKeys(signIn?.emailCode),
      signUpVerifications: getKeys(signUp?.verifications),
      signUpVerificationsEmailAddress: getKeys(signUp?.verifications?.emailAddress)
    };
  });
  
  console.log(JSON.stringify(result, null, 2));
  
  await browser.close();
})();
