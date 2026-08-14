# Oklab and Chromatic Vibration

Assessment of Björn Ottosson's Oklab material against the problem stated in [`color-contrast-and-legibility.md`](color-contrast-and-legibility.md) — quantifying chromatic vibration and correcting a pair that exhibits it. The source contains no perceptual-interaction theory, but it supplies the measurement axes the existing HSL model lacks, plus a projection primitive suited to remediation.

## Source Material

Four articles by Björn Ottosson (2020–2021):

| Article | Contribution |
| --- | --- |
| **A perceptual color space for image processing** | Oklab derivation, sRGB ↔ Oklab matrices |
| **sRGB gamut clipping** | Constant-hue line projection in $(L, C)$, cusp intersection, adaptive-$L_0$ methods |
| **Okhsv and Okhsl** | The $L_r$ lightness estimate; HSL/HSV-shaped spaces built over Oklab |
| **How software gets color wrong** | Linear-light vs. gamma-encoded blending |

Reference code is released to the public domain (dual-licensed MIT), so it is compatible with hex-mirror's GPL-3.0-or-later terms.

## Applicability Assessment

The material does **not** address chromatic vibration as a phenomenon. It contains no treatment of simultaneous contrast, chromatic aberration, chromostereopsis, Helmholtz–Kohlrausch, or legibility thresholds. Ottosson's subject is color *representation* — how to encode and manipulate a color so that numeric operations match perception — not color *interaction*.

What it does supply is the quantitative substrate that [`color-contrast-and-legibility.md`](color-contrast-and-legibility.md) currently describes only qualitatively. That note identifies three conditions for vibration — high saturation on both sides, near-complementary hue, similar luminance — and hex-mirror evaluates all three in HSL, where none of them are measurable.

## Limitations of the HSL Axes

- **`lum` is not luminance.** `hsl(60 100% 50%)` and `hsl(240 100% 50%)` both report $L = 0.5$ while differing by roughly an order of magnitude in relative luminance. The "similar luminance" precondition therefore cannot be tested on this axis, and the prediction that lightness-preserving mirror variants risk vibration is unverifiable for exactly the saturated hues most prone to it.
- **`sat` is not chroma.** HSL saturation is a normalization of the max–min channel spread, not a perceptual colorfulness. The `1 - sat` inversion in `complementHSL` shifts perceived lightness as a side effect, so the desaturation branch of the optimization rule disturbs the luminance edge it exists to protect.
- **`hue` spacing is not uniform.** A `360 - hue` reflection is a reflection of the RGB hexagon, not a perceptual complement; the error is largest through the blues, which is where chromostereopsis is also strongest.

## Oklab Conversion

Applied to **linear** sRGB (gamma-expanded per §1 of [`color-contrast-formulas.md`](color-contrast-formulas.md)):

$$
\begin{pmatrix} l \\ m \\ s \end{pmatrix} =
\begin{pmatrix}
0.4122214708 & 0.5363325363 & 0.0514459929 \\
0.2119034982 & 0.6806995451 & 0.1073969566 \\
0.0883024619 & 0.2817188376 & 0.6299787005
\end{pmatrix}
\begin{pmatrix} R_{\text{lin}} \\ G_{\text{lin}} \\ B_{\text{lin}} \end{pmatrix}
$$

$$
l' = \sqrt[3]{l}, \qquad m' = \sqrt[3]{m}, \qquad s' = \sqrt[3]{s}
$$

$$
\begin{pmatrix} L \\ a \\ b \end{pmatrix} =
\begin{pmatrix}
0.2104542553 & 0.7936177850 & -0.0040720468 \\
1.9779984951 & -2.4285922050 & 0.4505937099 \\
0.0259040371 & 0.7827717662 & -0.8086757660
\end{pmatrix}
\begin{pmatrix} l' \\ m' \\ s' \end{pmatrix}
$$

Inverse:

$$
l' = L + 0.3963377774\,a + 0.2158037573\,b
$$

$$
m' = L - 0.1055613458\,a - 0.0638541728\,b
$$

$$
s' = L - 0.0894841775\,a - 1.2914855480\,b
$$

$$
\begin{pmatrix} R_{\text{lin}} \\ G_{\text{lin}} \\ B_{\text{lin}} \end{pmatrix} =
\begin{pmatrix}
4.0767416621 & -3.3077115913 & 0.2309699292 \\
-1.2684380046 & 2.6097574011 & -0.3413193965 \\
-0.0041960863 & -0.7034186147 & 1.7076147010
\end{pmatrix}
\begin{pmatrix} (l')^3 \\ (m')^3 \\ (s')^3 \end{pmatrix}
$$

Polar form gives the two axes the vibration conditions are stated in:

$$
C = \sqrt{a^2 + b^2}, \qquad h = \operatorname{atan2}(b,\, a)
$$

Oklab is scaled so that near 50% gray, the ratio of color differences along $L$ and across the $ab$ plane matches the ratio predicted by CIEDE2000. Euclidean distance in Oklab is therefore a usable stand-in for the CIEDE2000 recommendation in §7 of [`color-contrast-formulas.md`](color-contrast-formulas.md), at a fraction of the arithmetic.

## The $L_r$ Lightness Estimate

Oklab is deliberately scale-independent and has no reference white, which limits its ability to predict lightness when the dynamic range *is* known — the situation for screen colors. With reference white $Y = 1$, Ottosson defines a corrected estimate $L_r$:

$$
k_1 = 0.206, \qquad k_2 = 0.03, \qquad k_3 = \frac{1 + k_1}{1 + k_2}
$$

$$
L_r = \tfrac{1}{2}\left(k_3 L - k_1 + \sqrt{(k_3 L - k_1)^2 + 4 k_2 k_3 L}\right)
$$

$$
L = \frac{L_r^2 + k_1 L_r}{k_3 (L_r + k_2)}
$$

$L_r$ tracks CIELab $L^*$ closely and coincides near mid-gray ($Y = 0.18406$ for CIELab, $0.18419$ for $L_r$). This is the correct axis for the "no stable luminance edge" condition: $\lvert \Delta L_r \rvert$ between two colors is a single scalar standing in for the whole precondition.

## Okhsl and Okhsv

The same article constructs HSL- and HSV-shaped spaces over Oklab, using $L_r$ for lightness and normalizing chroma against the sRGB gamut boundary for the given hue. These are structural analogues of [`src/utils/hsl.ts`](../src/utils/hsl.ts) with the same three-component interface, so the seven mirror variants transfer directly — but with each axis meaning what the contrast note assumes. `L → 1 − L` in Okhsl genuinely inverts perceived lightness; in HSL it does not.

## Proposed Vibration Metric

Not present in the source material — this composes Ottosson's axes into a score for the three conditions already named in [`color-contrast-and-legibility.md`](color-contrast-and-legibility.md). For two colors expressed as $(L_{r,i}, C_i, h_i)$:

$$
V = \underbrace{\frac{\min(C_1, C_2)}{C_{\text{ref}}}}_{\text{both sides vivid}} \cdot \underbrace{\frac{1 - \cos(\Delta h)}{2}}_{\text{hue opposition}} \cdot \underbrace{\max\!\left(0,\; 1 - \frac{\lvert \Delta L_r \rvert}{\tau}\right)}_{\text{no luminance edge}}
$$

Design notes on each term:

- **$\min$, not mean, of the chromas.** Desaturating one side is sufficient to eliminate vibration, which is precisely what the existing `S_bg > 0.5` rule does; $\min$ is the term that reproduces that behavior.
- **$(1 - \cos \Delta h)/2$** peaks at $\Delta h = 180°$ and falls to zero at $0°$, with a broad plateau near opposition rather than a hard threshold.
- **$\tau$ is the luminance-separation cutoff** past which vibration is suppressed regardless of hue and chroma. A starting value of $\tau \approx 0.20$ in $L_r$ corresponds roughly to the separation at which a pair begins clearing WCAG AA at normal text sizes.
- **$C_{\text{ref}}$ normalizes chroma** to the maximum available in sRGB. Using the per-hue cusp chroma $C_{\text{cusp}}(h)$ rather than a global constant keeps the term comparable across hues, since attainable chroma in sRGB varies by more than a factor of two with hue.

Both $\tau$ and the choice of $C_{\text{ref}}$ are unvalidated and would need to be fitted against judged pairs before the score carries weight.

## Remediation via Constant-Hue Projection

The gamut clipping article provides the correction primitive. Its framing — work in a perceptual space, hold hue fixed, move only along a straight line in $(L, C)$ — is exactly the operation a vibration fix requires, differing only in the stopping condition: clip to the gamut boundary, versus reduce chroma until $V$ falls below threshold.

Given a color $(L_1, C_1)$ at hue $h$ and an in-gamut anchor $(L_0, 0)$, the corrected color is the point $(L_t, C_t) = t(L_1, C_1) + (1-t)(L_0, C_0)$ for the appropriate $t$. Anchor choices, in increasing order of sophistication:

| Anchor | $L_0$ | Behavior |
| --- | --- | --- |
| **Preserve lightness** | $\operatorname{clamp}(L_1, 0, 1)$ | Pure chroma compression; the luminance edge is untouched. Best fit for vibration correction, since $\Delta L_r$ must be preserved. |
| **Fixed mid-gray** | $0.5$ | Hue-independent; sacrifices lightness. |
| **Cusp lightness** | $L_{\text{cusp}}(h)$ | Hue-dependent; targets the most chromatic point for that hue. |
| **Adaptive, hue-independent** | see below | Blends the first two, parameterized by $\alpha > 0$. |

The adaptive form, which mostly preserves lightness but degrades gracefully at the extremes where pure chroma compression collapses a color to gray:

$$
L_d = L_1 - 0.5, \qquad e_1 = \tfrac{1}{2} + \lvert L_d \rvert + \alpha C_1
$$

$$
L_0 = \frac{1 + \operatorname{sgn}(L_d)\left(e_1 - \sqrt{e_1^2 - 2\lvert L_d \rvert}\right)}{2}
$$

Small $\alpha$ approaches pure chroma compression; large $\alpha$ approaches single-point projection. A hue-dependent variant substitutes $L_{\text{cusp}}$ for $0.5$.

Locating the gamut boundary along the line requires the cusp $(L_{\text{cusp}}, C_{\text{cusp}})$, which depends only on hue. Ottosson obtains it from a fitted approximation refined by one step of Halley's method, accurate to better than $10^{-6}$; a 1-D lookup table over hue is an equivalent option.

## Mapping to hex-mirror

| Module | Change implied |
| --- | --- |
| [`src/utils/hsl.ts`](../src/utils/hsl.ts) | Unchanged — HSL remains the user-facing input model. |
| *new* `src/utils/oklab.ts` | sRGB ↔ Oklab, polar $LCh$, $L_r$ toe and inverse. |
| *new* `src/utils/vibration.ts` | $V$ score plus constant-hue chroma reduction to a target threshold. |
| [`reference/color-contrast-and-legibility.md`](color-contrast-and-legibility.md) | Its per-variant "prone to vibration / reliably legible" column becomes computed rather than asserted. |
| [`reference/color-contrast-formulas.md`](color-contrast-formulas.md) | §6's saturation branch (`S_bg > 0.5` → desaturate) is replaced by a chroma projection that leaves $L_r$ fixed. |

## Coverage Gaps

The source material offers nothing on these, and they remain open:

- Threshold calibration for $\tau$ and the vibration score generally — no psychophysical data is provided.
- Spatial frequency and edge geometry. Vibration depends on stimulus size and edge length; a color-space model has no term for either.
- Chromostereopsis specifically. The red↔blue depth effect is refractive, not a property of the color coordinates, so a hue-opposition term only partially captures it.
- Color vision deficiency. Oklab models normal trichromatic vision.

## Sources

[^oklab]: [A perceptual color space for image processing (Oklab) — Björn Ottosson](https://bottosson.github.io/posts/oklab/)
[^okhsl]: [Okhsv and Okhsl — Björn Ottosson](https://bottosson.github.io/posts/colorpicker/)
[^gamutclip]: [sRGB gamut clipping — Björn Ottosson](https://bottosson.github.io/posts/gamutclipping/)
[^colorwrong]: [How software gets color wrong — Björn Ottosson](https://bottosson.github.io/posts/colorwrong/)
[^gamutsurvey]: [The Fundamentals of Gamut Mapping: A Survey — Morovic & Luo](https://www.ingentaconnect.com/content/ist/jist/2001/00000045/00000003/art00008)

* This file was generated by AI and may not be accurate.
