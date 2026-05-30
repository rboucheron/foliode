import { test } from "@playwright/test";
import { clickSignInBtn, fillSignUpForm } from "@utils/auth/signupForm";

test("sign up and create portfolio ", async ({ page }) => {
  await page.goto("");
  await fillSignUpForm(page);
  await clickSignInBtn(page); 
  

});
