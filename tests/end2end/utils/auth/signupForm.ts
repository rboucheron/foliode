import { Page } from "playwright";

export const fillSignUpForm = async (page: Page) => {
  await page.getByRole("link", { name: "Inscription" }).click();
  await page.getByRole("textbox", { name: "Email Email*" }).click();
  await page
    .getByRole("textbox", { name: "Email Email*" })
    .fill("raphaelboucheron+5@gmail.com");
  await page.getByRole("textbox", { name: "Prénom Prénom*" }).click();
  await page.getByRole("textbox", { name: "Prénom Prénom*" }).fill("Rapha");
  await page.getByRole("textbox", { name: "Nom Nom*" }).click();
  await page.getByRole("textbox", { name: "Nom Nom*" }).fill("Boucheron");
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
