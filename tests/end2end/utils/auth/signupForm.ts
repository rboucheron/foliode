import { Page } from "playwright";
import { generatePerson } from "./generatePerson";

export const fillSignUpForm = async (page: Page) => {
  const person = generatePerson();
  await page.getByRole("link", { name: "Inscription" }).click();
  await page.getByRole("textbox", { name: "Email Email*" }).click();
  await page.getByRole("textbox", { name: "Email Email*" }).fill(person.email);
  await page.getByRole("textbox", { name: "Prénom Prénom*" }).click();
  await page
    .getByRole("textbox", { name: "Prénom Prénom*" })
    .fill(person.lastName);
  await page.getByRole("textbox", { name: "Nom Nom*" }).click();
  await page.getByRole("textbox", { name: "Nom Nom*" }).fill(person.firstName);
  await page
    .getByRole("textbox", { name: "Mot de passe Mot de passe*" })
    .click();
  await page
    .getByRole("textbox", { name: "Mot de passe Mot de passe*" })
    .fill("MotDepas3459,");
  await page.getByRole("textbox", { name: "Confirmer mot de passe" }).click();
  await page
    .getByRole("textbox", { name: "Confirmer mot de passe" })
    .fill("MotDepas3459,");
};
