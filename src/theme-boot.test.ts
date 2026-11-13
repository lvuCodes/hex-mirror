import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY } from "@lvucodes/ui";
import { applySiteTheme } from "./theme-boot";

describe("applySiteTheme", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete document.documentElement.dataset.theme;
  });

  it("sets lvuCodes on the document root", () => {
    applySiteTheme();
    expect(document.documentElement.dataset.theme).toBe("lvucodes");
  });

  it("overrides a theme the visitor picked elsewhere without touching storage", () => {
    const setItem = vi.fn();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => (k === THEME_STORAGE_KEY ? "basic" : null),
      setItem,
    });
    document.documentElement.dataset.theme = "basic";
    applySiteTheme();
    expect(document.documentElement.dataset.theme).toBe("lvucodes");
    expect(setItem).not.toHaveBeenCalled();
  });
});
