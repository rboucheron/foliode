import { test, expect } from "@playwright/test";
import { fillSignUpForm } from "@utils/auth/signupForm";

test("get started and fill register form ", async ({ page }) => {
  await page.goto("");
  await fillSignUpForm(page);
  test("", async ({page}) => {
    
  })
});
