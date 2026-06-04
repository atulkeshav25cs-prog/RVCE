const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/citizen/signup');
  await page.waitForFunction('window.__DEBUG_SIGNUP !== undefined');
  
  const result = await page.evaluate(() => {
    const signIn = window.__DEBUG_SIGNIN;
    const signUp = window.__DEBUG_SIGNUP;
    
    return {
      keysSignUp: Object.keys(signUp),
      keysSignIn: Object.keys(signIn),
      keysSignUpVerifications: Object.keys(signUp.verifications || {}),
      keysSignInEmailCode: Object.keys(signIn.emailCode || {}),
      typeSendEmailCode: typeof signUp.verifications.sendEmailCode,
      typeVerifyEmailCode: typeof signUp.verifications.verifyEmailCode,
      typeSignInSendCode: typeof signIn.emailCode.sendCode,
      typeSignInVerifyCode: typeof signIn.emailCode.verifyCode,
      typeSignInSso: typeof signIn.sso,
      typeSignUpSso: typeof signUp.sso,
    };
  });
  
  console.log("=== RUNTIME PROOF ===");
  console.log("Object.keys(signUp) =", result.keysSignUp);
  console.log("Object.keys(signIn) =", result.keysSignIn);
  console.log("Object.keys(signUp.verifications || {}) =", result.keysSignUpVerifications);
  console.log("Object.keys(signIn.emailCode || {}) =", result.keysSignInEmailCode);
  console.log("typeof signUp.verifications.sendEmailCode =", result.typeSendEmailCode);
  console.log("typeof signUp.verifications.verifyEmailCode =", result.typeVerifyEmailCode);
  console.log("typeof signIn.emailCode.sendCode =", result.typeSignInSendCode);
  console.log("typeof signIn.emailCode.verifyCode =", result.typeSignInVerifyCode);
  console.log("typeof signIn.sso =", result.typeSignInSso);
  console.log("typeof signUp.sso =", result.typeSignUpSso);
  
  await browser.close();
})();
