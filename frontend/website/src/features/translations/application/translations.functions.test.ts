import { describe, expect, test } from "bun:test";
import { loadTranslationFiles, saveTranslationFiles } from "./translations.functions";

describe("translation server functions", () => {
  test("loads every configured locale and namespace", async () => {
    const files = await loadTranslationFiles();

    expect(Object.keys(files)).toEqual(expect.arrayContaining(["fr", "en"]));
    expect(files.fr.common).toBeDefined();
    expect(files.en.projects).toBeDefined();
  });

  test("rejects incomplete translation payloads", async () => {
    await expect(saveTranslationFiles({ data: {} as never })).rejects.toThrow("Langue manquante");
  });
});
