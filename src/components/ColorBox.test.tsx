import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ColorBox from "./ColorBox";
import { calculateHexAttr } from "../utils";

const { mirrorSet } = calculateHexAttr({ red: 128, green: 64, blue: 200 });

describe("ColorBox", () => {
  it("renders one row per mirror with its hex and description", () => {
    const { container } = render(<ColorBox set={mirrorSet} />);

    expect(container.querySelectorAll("tbody tr")).toHaveLength(9);
    expect(container.querySelectorAll(".desc")).toHaveLength(9);
    expect(
      screen.getByText(`#${mirrorSet.mirror_HSL}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`#${mirrorSet.mirror_midpoint}:`)
    ).toBeInTheDocument();
  });

  it("colors each poem line with its mirror hex", () => {
    render(<ColorBox set={mirrorSet} />);
    const line = screen.getByText(
      "For the moon never beams, without bringing me dreams"
    );
    expect(line).toHaveStyle({ color: `#${mirrorSet.mirror_HSl}` });
  });
});
