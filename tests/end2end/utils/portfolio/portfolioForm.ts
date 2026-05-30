import { fillNextUIInput } from "@utils/next/input";
import { Page } from "playwright";

export const fillCreatePortfolioForm = async (page: Page) => {
  await fillNextUIInput(
    page.getByTestId("portfolio-title-input"),
    "Titre du portfolio",
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
  await page.getByRole("button", { name: "Suivant" }).click();
};

export const selectPortfolioTemplate = async (page: Page) => {
  await page.getByRole("button", { name: "Bento Bento" }).click();
  await page.getByRole("button", { name: "Bento", exact: true }).click();
};

export const clickPublishPortfolioButton = async (page: Page) => {
  await page.getByRole("button", { name: "Publier" }).click();
};
