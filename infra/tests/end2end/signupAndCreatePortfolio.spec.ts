import { expect, test } from "@playwright/test";
import {
  clickNextStepButton,
  clickPublishPortfolioButton,
  fillCreatePortfolioForm,
  selectPortfolioTemplate,
} from "@utils/portfolio/portfolioForm";
import { clickSignInBtn, fillSignUpForm } from "@utils/auth/signupForm";

test("sign up and create portfolio ", async ({ page }) => {
  await page.goto("");
  await fillSignUpForm(page);
  await clickSignInBtn(page);

  await expect(page).toHaveURL(/\/portfolio\/edit/);

  await fillCreatePortfolioForm(page, `Portfolio E2E ${Date.now()}`);
  await clickNextStepButton(page);
  await clickNextStepButton(page);
  await clickNextStepButton(page);
  await selectPortfolioTemplate(page);
  await clickPublishPortfolioButton(page);

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText("Couleurs du portfolio")).toBeVisible();

});

test("first signup redirects to portfolio creation", async ({ page }) => {
  await page.goto("");
  await fillSignUpForm(page);
  await clickSignInBtn(page);

  await expect(page).toHaveURL(/\/portfolio\/edit/);
  await expect(page.getByTestId("portfolio-title-input")).toBeVisible();
});
