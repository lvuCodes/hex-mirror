# Glossary

- **APCA (Advanced Perceptual Contrast Algorithm):** a contrast measure drafted for WCAG 3. It reports a lightness contrast value (Lc) that depends on which color is the text and which is the background, and it accounts for font size and weight.
- **CIEDE2000:** the current standard formula for ΔE. It corrects CIE76's uneven accuracy across hues and is preferred for real judgments of whether two colors look different. See [color-contrast-formulas.md](color-contrast-formulas.md).
- **CIELAB (L\*a\*b\*):** a color space designed so that equal numeric steps look like roughly equal visual steps. `L*` is lightness, `a*` runs green to red, `b*` runs blue to yellow.
- **Chroma:** how colorful a color is compared with a gray of the same lightness. Unlike HSL saturation, it is a perceptual measure. See [hsl-and-hsv.md](hsl-and-hsv.md).
- **Chromatic aberration:** the eye's lens (or any lens) focusing different wavelengths at different depths, so short-wavelength blue focuses in front of long-wavelength red. It produces colored fringing at saturated edges and causes chromostereopsis.
- **Chromatic vibration (color vibration, optical vibration):** shimmering or buzzing along the edge between two highly saturated, near-complementary colors of similar lightness. See [chromatic-vibration.md](blog-drafts/chromatic-vibration.md).
- **Chromostereopsis:** a depth illusion in which flat colors appear at different distances, usually red in front of blue or cyan, caused by chromatic aberration in the eye. See [chromostereopsis.md](blog-drafts/chromostereopsis.md).
- **Color clash:** an informal term for any pairing of colors that looks unpleasant together. It covers chromatic vibration, chromostereopsis, and simple low contrast.
- **Color vision deficiency (CVD):** reduced ability to tell certain hues apart, most often red from green. It affects about 8% of men, so a design should not rely on hue difference alone.
- **Complementary colors:** two hues on opposite sides of the color wheel (about 180° apart), such as red and cyan or orange and blue. In hex-mirror the HSL complement is `360 − hue`. See [complement-formulas.md](complement-formulas.md).
- **Contrast ratio (WCAG):** `(L1 + 0.05) / (L2 + 0.05)`, where `L1` is the lighter color's relative luminance and `L2` the darker one's. It ranges from 1:1 (identical) to 21:1 (black on white) and measures brightness difference only, ignoring hue.
- **ΔE (Delta E):** the distance between two colors in CIELAB, used as a measure of how different they look. A ΔE near 1 is roughly the smallest difference a viewer can notice.
- **Gamma encoding (gamma expansion):** sRGB channel values are stored on a curve that is not proportional to light intensity. Gamma expansion converts them back to linear values before luminance or blending math is done. See [color-contrast-formulas.md](color-contrast-formulas.md).
- **Gamut:** the full set of colors a color space or display can produce. A color outside the sRGB gamut cannot be shown as a hex code.
- **Halation:** a glowing blur around bright text on a dark background, strongest with pure white on pure black. It is why maximum contrast is not the most comfortable choice for long reading.
- **HSL (Hue, Saturation, Lightness):** a cylinder-shaped rearrangement of RGB that hex-mirror uses for its mirror variants. Its lightness and saturation axes are not perceptual measures. See [hsl-and-hsv.md](hsl-and-hsv.md).
- **HSV (Hue, Saturation, Value):** a sibling of HSL in which value is the largest of the three RGB channels. See [hsl-and-hsv.md](hsl-and-hsv.md).
- **Hue:** the position of a color on the color wheel, given in degrees from 0 to 360 (red at 0°, green at 120°, blue at 240°).
- **Large text (WCAG):** text at least 24px regular or 18.66px bold. It has lower contrast requirements (3:1 for AA, 4.5:1 for AAA).
- **Lightness:** how light or dark a color looks. HSL lightness is the average of the largest and smallest RGB channels, which does not match perceived lightness across hues.
- **Linear RGB:** RGB values after gamma expansion, proportional to the amount of light. Luminance and contrast formulas use these values.
- **Luminance (relative luminance):** the perceived brightness of a color, from 0 (black) to 1 (white): `0.2126 R + 0.7152 G + 0.0722 B` on linear RGB. Green contributes most and blue least. See [color-contrast-formulas.md](color-contrast-formulas.md).
- **Non-text contrast (WCAG SC 1.4.11):** the 3:1 minimum contrast for user-interface parts and meaningful graphics, such as input borders, icons, and chart lines.
- **Okhsl and Okhsv:** HSL-shaped and HSV-shaped color pickers built on Oklab, so their axes track perceived lightness and colorfulness. See [oklab-and-chromatic-vibration.md](oklab-and-chromatic-vibration.md).
- **Oklab:** a perceptual color space by Björn Ottosson that predicts lightness, chroma, and hue more evenly than CIELAB, and is simple to compute from linear RGB. See [oklab-and-chromatic-vibration.md](oklab-and-chromatic-vibration.md).
- **Opponent process:** the retina's encoding of color as three opposing signals: red against green, blue against yellow, and light against dark. Complementary hues drive the color signals to opposite extremes.
- **Saturation:** in HSL, how far a color is from gray, scaled from 0% to 100%. It is a normalization of the RGB channel spread, not a perceptual measure. Compare chroma.
- **Simultaneous contrast:** neighboring colors changing each other's appearance, each pushing the other toward its own complement. Josef Albers documented it in *Interaction of Color*.
- **sRGB:** the standard RGB color space for the web. Every hex code is an sRGB color.
- **WCAG (Web Content Accessibility Guidelines):** the W3C accessibility standard. Its text-contrast levels are AA (4.5:1 for normal text, 3:1 for large text) and AAA (7:1 for normal text, 4.5:1 for large text).

* This file was generated by AI and may not be accurate.
