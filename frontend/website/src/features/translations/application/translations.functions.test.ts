import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { loadTranslationFilesFromDirectory, validateTranslationFiles } from "./translations.functions";

describe("translation server logic", () => {
  test("loads every configured locale and namespace", async () => {
    const files = await loadTranslationFilesFromDirectory(join(import.meta.dir, "../../../locales"));

    expect(Object.keys(files)).toEqual(expect.arrayContaining(["fr", "en"]));
    expect(files.fr.common).toBeDefined();
    expect(files.en.projects).toBeDefined();
  });

  test("rejects incomplete translation payloads", () => {
    expect(() => validateTranslationFiles({})).toThrow("Langue manquante");
  });
});
