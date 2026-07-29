import { expect, test } from "@playwright/test";
import {
  bootstrapPortfolioOwner,
  getPortfolioStatusLabel,
  openDashboardEditPage,
} from "@utils/portfolio/dashboardEdit";

test("toggle portfolio visibility from dashboard edit", async ({ page }) => {
  await bootstrapPortfolioOwner(page, `Portfolio Toggle ${Date.now()}`);
  await openDashboardEditPage(page);

  const toggleButton = page.getByTestId("dashboard-edit-visibility-toggle");
  await expect(toggleButton).toBeVisible();

  const initialStatus = await getPortfolioStatusLabel(page);
  await toggleButton.click();

  if (initialStatus.includes("En ligne")) {
    await expect(page.getByTestId("dashboard-edit-status-text")).toContainText(
      "Hors ligne",
    );
    await expect(toggleButton).toContainText("Passer en public");
  } else {
    await expect(page.getByTestId("dashboard-edit-status-text")).toContainText(
      "En ligne",
    );
    await expect(toggleButton).toContainText("Passer en brouillon");
  }
});

test("persist title update from dashboard edit", async ({ page }) => {
  await bootstrapPortfolioOwner(page, `Portfolio Update ${Date.now()}`);
  await openDashboardEditPage(page);

  const updatedTitle = `Titre modifie ${Date.now()}`;
  await page.getByTestId("dashboard-edit-title-input").fill(updatedTitle);
  await page.getByTestId("dashboard-edit-save-button").click();

  await page.reload();
  await expect(page.getByTestId("dashboard-edit-title-input")).toHaveValue(
    updatedTitle,
  );
});
