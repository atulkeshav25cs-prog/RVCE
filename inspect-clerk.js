const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/citizen/signup');
  
  // Wait until our debug variables are attached
  await page.waitForFunction('window.__DEBUG_SIGNUP !== undefined');
  
  const result = await page.evaluate(() => {
    const clerk = window.__DEBUG_CLERK;
    const signIn = window.__DEBUG_SIGNIN;
    const signUp = window.__DEBUG_SIGNUP;
    
    // Safely serialize an object avoiding circular refs and stripping internal react stuff
    function serialize(obj) {
      if (!obj) return null;
      let out = {};
      for (let k in obj) {
        if (typeof obj[k] === 'function') out[k] = '[Function]';
        else if (typeof obj[k] === 'object') out[k] = '[Object]';
        else out[k] = obj[k];
      }
      return out;
    }

    return {
      clerkKeys: clerk ? Object.keys(clerk) : null,
      signInKeys: signIn ? Object.keys(signIn) : null,
      signUpKeys: signUp ? Object.keys(signUp) : null,
      clerkProto: clerk ? Object.getOwnPropertyNames(Object.getPrototypeOf(clerk)) : null,
      signInProto: signIn ? Object.getOwnPropertyNames(Object.getPrototypeOf(signIn)) : null,
      signUpProto: signUp ? Object.getOwnPropertyNames(Object.getPrototypeOf(signUp)) : null,
      clerkObj: serialize(clerk),
      signInObj: serialize(signIn),
      signUpObj: serialize(signUp),
    };
  });
  
  console.log(JSON.stringify(result, null, 2));
  
  await browser.close();
})();
