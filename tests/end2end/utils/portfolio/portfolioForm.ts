import { fillNextUIInput } from "@utils/next/input";
import { Page } from "@playwright/test";

export const fillCreatePortfolioForm = async (
  page: Page,
  title = "Titre du portfolio",
) => {
  await fillNextUIInput(
    page.getByTestId("portfolio-title-input"),
    title,
  );
  await fillNextUIInput(
    page.getByTestId("portfolio-subtitle-input"),
    "sous titre du portfolio",
  );
  await fillNextUIInput(
    page.getByTestId("portfolio-bio-input"),
    "sous titre du portfolio",
  );
};

export const clickNextStepButton = async (page: Page) => {
  await page.getByTestId("portfolio-edit-next-step").click();
};

export const selectPortfolioTemplate = async (page: Page) => {
  await page.getByTestId("portfolio-template-template-1").click();
  await page.getByTestId("portfolio-style-bento").click();
};

export const clickPublishPortfolioButton = async (page: Page) => {
  await page.getByTestId("portfolio-edit-publish").click();
};
