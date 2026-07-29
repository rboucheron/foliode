import { Locator } from "@playwright/test";

export const fillNextUIInput = async (nextUiInput: Locator, text: string) => {
  await nextUiInput.click();
  await nextUiInput.fill(text);
};
