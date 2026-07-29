import { Page } from "@playwright/test";
import { generatePerson } from "./generatePerson";
import { fillNextUIInput } from "@utils/next/input";

export const fillSignUpForm = async (page: Page) => {
  const person = generatePerson();
  await page.getByRole("link", { name: "Inscription" }).click();
  await fillNextUIInput(page.getByTestId("email-input"), person.email);
  await fillNextUIInput(page.getByTestId("firstname-input"), person.firstName);
  await fillNextUIInput(page.getByTestId("lastname-input"), person.lastName);
  await fillNextUIInput(page.getByTestId("password-input"), "MotDepas3459,");
  await fillNextUIInput(
    page.getByTestId("password-confirm-input"),
    "MotDepas3459,",
  );
};

export const clickSignInBtn = async (page: Page) => {
  await page.getByTestId("signup-submit").click();
};
