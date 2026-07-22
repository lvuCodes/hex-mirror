// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import InputCard from "./components/DisplayCard";
import { BackLink } from "@lvucodes/ui";

export default function App() {
  return (
    <div className="App">
      <BackLink />
      <div className="page">
        <h1>Hex Mirror</h1>
        <h2>Provide a hexcode to find its mirror set.</h2>
        <InputCard />
        <footer className="credits">
          <p className="credits-copyright">
            © 2026{" "}
            <a href="https://github.com/lvuCodes" target="_blank" rel="noreferrer noopener">
              lvuCodes
            </a>
            . Free software under the{" "}
            <a
              href="https://github.com/lvuCodes/hex-mirror/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer noopener"
            >
              GNU GPL v3
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}

// TODO
// - dark mode
// - copy hex - cursor: copy;
// - opacity slider XOR submit button
// - hover state (?) to indicate which mirror hex
// - provide formulas for each calculation
