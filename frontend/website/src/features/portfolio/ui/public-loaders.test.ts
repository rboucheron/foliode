import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Portfolio } from "../domain/portfolio";

const portfolio: Portfolio = {
  title: "Foliode de Raphael",
  subtitle: "Développeur full-stack",
  bio: "Portfolio de Raphael Boucheron.",
  template: "sunset",
  url: "rbou",
  config: {
    colors: {
      primary: "#111827",
      secondary: "#f9fafb",
      warning: "#f3f4f6",
      success: "#e5e7eb",
      info: "#6b7280",
      light: "#ffffff",
    },
  },
  users: {
    firstname: "Raphael",
    lastname: "Boucheron",
    username: "rabouch",
    email: "raphael@example.test",
    avatar_url: null,
    promotion: null,
  },
  projects: [
    {
      id: "project-1",
      title: "Foliode",
      description: "Portfolio Symfony et TanStack Start.",
      projectsLinks: [],
    },
  ],
  tools: [],
};

const getPublicPortfolioByUrl = mock(async () => portfolio);
mock.module("../application/portfolio.api", () => ({ getPublicPortfolioByUrl }));

const { loadPublicPortfolio } = await import("./public-portfolio-page");
const { loadPublicProject } = await import("./public-project-page");

describe("public portfolio loaders", () => {
  beforeEach(() => {
    getPublicPortfolioByUrl.mockResolvedValue(portfolio);
  });

  test("normalizes the Raphael portfolio and resolves its project", async () => {
    const loaded = await loadPublicPortfolio("rbou");
    const project = await loadPublicProject("rbou", "Foliode");

    expect(loaded.users.firstname).toBe("Raphael");
    expect(loaded.users.username).toBe("rabouch");
    expect(loaded.config.colors).toEqual(expect.objectContaining({ primary: expect.any(String) }));
    expect(project.project.id).toBe("project-1");
  });

  test("maps an API failure to the router not-found response", async () => {
    getPublicPortfolioByUrl.mockRejectedValueOnce(new Error("not found"));

    await expect(loadPublicPortfolio("unknown")).rejects.toBeDefined();
  });
});
