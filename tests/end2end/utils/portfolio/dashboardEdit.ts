import { expect, Page } from "@playwright/test";
import { clickSignInBtn, fillSignUpForm } from "@utils/auth/signupForm";
import {
  clickNextStepButton,
  clickPublishPortfolioButton,
  fillCreatePortfolioForm,
  selectPortfolioTemplate,
} from "@utils/portfolio/portfolioForm";

export const bootstrapPortfolioOwner = async (
  page: Page,
  title: string,
): Promise<void> => {
  await page.goto("");
  await fillSignUpForm(page);
  await clickSignInBtn(page);

  await expect(page).toHaveURL(/\/portfolio\/edit/);

  await fillCreatePortfolioForm(page, title);
  await clickNextStepButton(page);
  await clickNextStepButton(page);
  await clickNextStepButton(page);
  await selectPortfolioTemplate(page);
  await clickPublishPortfolioButton(page);

  await expect(page).toHaveURL(/\/dashboard/);
};

export const openDashboardEditPage = async (page: Page): Promise<void> => {
  await page.goto("/dashboard/edit");
  await expect(page.getByTestId("dashboard-edit-title-input")).toBeVisible();
};

export const getPortfolioStatusLabel = async (page: Page): Promise<string> => {
  const status = page.getByTestId("dashboard-edit-status-text");
  await expect(status).toBeVisible();
  return (await status.textContent())?.trim() ?? "";
};
