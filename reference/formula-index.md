# Formula Index

Consolidated index of every formula appearing in the [`reference/`](.) notes, cross-referenced against what [`src/utils/`](../src/utils) actually implements. Each entry carries one of three states:

- **Implemented** — present in code, covered by a co-located `*.test.ts`.
- **Documented** — specified in a reference note, no implementation.
- **Proposed** — sketched in [`oklab-and-chromatic-vibration.md`](oklab-and-chromatic-vibration.md), not specified or fitted.

## Implementation Status

| Formula | Reference | Module · Function | State |
| --- | --- | --- | --- |
| **Hex ↔ decimal channel** | [complement](complement-formulas.md) | `hexadecimal.ts` · `decToHex`, `hexToDec` | Implemented |
| **3-digit shorthand expansion** | — | `hexadecimal.ts` · `hexStringToRGB` | Implemented |
| **Hex validation** | — | `hexadecimal.ts` · `isHexCode` | Implemented |
| **Random channel** | — | `decimal.ts` · `getRandom256` | Implemented |
| **RGB → HSL** | [contrast §4](color-contrast-formulas.md), [HSL/HSV](hsl-and-hsv.md) | `hsl.ts` · `getHSL` | Implemented |
| **HSL → RGB → hex** | [contrast §5](color-contrast-formulas.md), [HSL/HSV](hsl-and-hsv.md) | `hsl.ts` · `hslToHex` | Implemented |
| **Per-axis HSL complement** | [complement](complement-formulas.md) | `hsl.ts` · `complementHSL` | Implemented |
| **Seven mirror variants** | [complement](complement-formulas.md) | `complement.ts` · `getMirrorSet` | Implemented |
| **Channel complement** $255 - v$ | [complement](complement-formulas.md) | `complement.ts` · `complementChannel`, `getMidpointComp` | Implemented |
| **Uniform lightness shift** | [complement](complement-formulas.md) | `complement.ts` · `getGSheetsComp` | Implemented |
| **sRGB gamma expansion** | [contrast §1](color-contrast-formulas.md), [code ref §1](color-contrast-code-reference.md) | — | Documented |
| **Relative luminance** | [contrast §2](color-contrast-formulas.md), [code ref §2](color-contrast-code-reference.md) | — | Documented |
| **WCAG contrast ratio** | [contrast §3](color-contrast-formulas.md), [code ref §3](color-contrast-code-reference.md) | — | Documented |
| **Text-on-background rule** | [contrast §6](color-contrast-formulas.md), [code ref §6](color-contrast-code-reference.md) | — | Documented |
| **ΔE (CIE76)** | [contrast §7](color-contrast-formulas.md) | — | Documented |
| **Polar chroma / hue** $(\alpha, \beta)$ | [HSL/HSV](hsl-and-hsv.md) | — | Documented |
| **HSV / HSI saturation** | [HSL/HSV](hsl-and-hsv.md) | — | Documented |
| **HSL ↔ HSV interconversion** | [HSL/HSV](hsl-and-hsv.md) | — | Documented |
| **Luma–chroma–hue → RGB** | [HSL/HSV](hsl-and-hsv.md) | — | Documented |
| **sRGB ↔ Oklab** | [Oklab](oklab-and-chromatic-vibration.md) | — | Proposed |
| **$L_r$ toe / inverse** | [Oklab](oklab-and-chromatic-vibration.md) | — | Proposed |
| **Vibration score $V$** | [Oklab](oklab-and-chromatic-vibration.md) | — | Proposed |
| **Constant-hue chroma projection** | [Oklab](oklab-and-chromatic-vibration.md) | — | Proposed |

Everything the app computes today lives in RGB and HSL. Every luminance-, contrast-, and perception-aware formula in the reference set is unimplemented — which is why the legibility claims in [`color-contrast-and-legibility.md`](color-contrast-and-legibility.md) are currently asserted rather than measured.

## Channel Encoding

Two hex digits span one byte, giving each channel the range $[0, 255]$:

$$
\texttt{FF}_{16} = 15 \times 16 + 15 = 255_{10}, \qquad 16^2 = 2^8 = 256
$$

A 3-digit code expands by digit doubling (`abc` → `aabbcc`) so both forms round-trip identically. A random color draws each channel independently:

$$
v = \lfloor \operatorname{rand}() \times 256 \rfloor, \qquad v \in [0, 255]
$$

## RGB → HSL

Given $R, G, B \in [0, 1]$ (channels divided by 255):

$$
M = \max(R, G, B), \qquad m = \min(R, G, B), \qquad \Delta = M - m
$$

$$
L = \frac{M + m}{2}
$$

$$
S = \begin{cases}
0 & \text{if } \Delta = 0 \\[6pt]
\dfrac{\Delta}{1 - \lvert 2L - 1 \rvert} & \text{otherwise}
\end{cases}
$$

$$
H = \begin{cases}
0 & \text{if } \Delta = 0 \\[6pt]
60° \times \left(\dfrac{G - B}{\Delta} \bmod 6\right) & \text{if } M = R \\[10pt]
60° \times \left(\dfrac{B - R}{\Delta} + 2\right) & \text{if } M = G \\[10pt]
60° \times \left(\dfrac{R - G}{\Delta} + 4\right) & \text{if } M = B
\end{cases}
$$

Negative hues are wrapped by $H \mathrel{+}= 360$. Ranges: $H \in [0°, 360°)$, $S, L \in [0, 1]$.

$\Delta$ is *chroma* — the size of the hexagon through the point when the RGB cube is projected onto the plane perpendicular to the neutral axis. Saturation is that chroma rescaled to fill $[0, 1]$ at the given lightness, which is why $S$ is not a perceptual quantity.

## HSL → RGB

$$
C = (1 - \lvert 2L - 1 \rvert) \cdot S, \qquad X = C \left(1 - \left\lvert \frac{H}{60} \bmod 2 - 1 \right\rvert \right), \qquad m = L - \frac{C}{2}
$$

$$
(R', G', B') = \begin{cases}
(C, X, 0) & 0 \leq H < 60 \\
(X, C, 0) & 60 \leq H < 120 \\
(0, C, X) & 120 \leq H < 180 \\
(0, X, C) & 180 \leq H < 240 \\
(X, 0, C) & 240 \leq H < 300 \\
(C, 0, X) & 300 \leq H < 360
\end{cases}
$$

$$
(R, G, B) = \operatorname{round}\big((R' + m) \times 255,\; (G' + m) \times 255,\; (B' + m) \times 255\big)
$$

## Complement Operations

Three independent axis complements underlie the mirror set:

$$
H' = 360 - H, \qquad S' = 1 - S, \qquad L' = 1 - L
$$

$H' = 360 - H$ is a reflection across the $0°/360°$ boundary, **not** the opposing hue $H + 180°$. The two coincide only at $H = 180°$.

`getMirrorSet` emits all seven non-identity combinations. Uppercase in the key means the complemented axis is used:

| Key | $(H, S, L)$ | Axes complemented |
| --- | --- | --- |
| `mirror_HSL` | $(360-H,\ 1-S,\ 1-L)$ | all three |
| `mirror_HSl` | $(360-H,\ 1-S,\ L)$ | hue, saturation |
| `mirror_HsL` | $(360-H,\ S,\ 1-L)$ | hue, lightness |
| `mirror_Hsl` | $(360-H,\ S,\ L)$ | hue |
| `mirror_hSL` | $(H,\ 1-S,\ 1-L)$ | saturation, lightness |
| `mirror_hSl` | $(H,\ 1-S,\ L)$ | saturation |
| `mirror_hsL` | $(H,\ S,\ 1-L)$ | lightness |

Two further variants operate directly in RGB.

**Midpoint** — point reflection through the cube center $(127.5, 127.5, 127.5)$, i.e. the photographic negative:

$$
(R', G', B') = (255 - R,\; 255 - G,\; 255 - B)
$$

**Uniform lightness shift** — a constant $K = 115$ added to every channel, signed by lightness, reproducing the dark/light pairing behavior of Google Sheets. Because the shift is equal across channels, hue and saturation survive approximately intact:

$$
\delta = \begin{cases} +K & \text{if } L < 0.5 \\ -K & \text{if } L \geq 0.5 \end{cases}
\qquad
(R', G', B') = \operatorname{clamp}\big((R, G, B) + \delta,\; 0,\; 255\big)
$$

$$
\operatorname{clamp}(x, a, b) = \max(a,\, \min(b,\, x))
$$

## Luminance and Contrast

Documented in [`color-contrast-formulas.md`](color-contrast-formulas.md) and [`color-contrast-code-reference.md`](color-contrast-code-reference.md); no implementation exists.

Gamma expansion, applied per channel:

$$
c_{\text{sRGB}} = \frac{c}{255}, \qquad
c_{\text{linear}} = \begin{cases}
\dfrac{c_{\text{sRGB}}}{12.92} & \text{if } c_{\text{sRGB}} \leq 0.04045 \\[10pt]
\left(\dfrac{c_{\text{sRGB}} + 0.055}{1.055}\right)^{2.4} & \text{otherwise}
\end{cases}
$$

WCAG relative luminance and contrast ratio, with $L_1 \geq L_2$:

$$
Y = 0.2126\, R_{\text{linear}} + 0.7152\, G_{\text{linear}} + 0.0722\, B_{\text{linear}}
$$

$$
\text{ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}
$$

| Ratio | Requirement |
| --- | --- |
| 3:1 | AA, large text |
| 4.5:1 | AA, normal text |
| 7:1 | AAA, normal text |

The text-on-background rule derives $(H_t, S_t, L_t)$ from a background $(H_{bg}, S_{bg}, L_{bg})$:

$$
L_t = \begin{cases}
[0.05,\, 0.15] & \text{if } L_{bg} > 0.5 \\
[0.85,\, 0.95] & \text{if } L_{bg} \leq 0.5
\end{cases}
\qquad
H_t = (H_{bg} + 180) \bmod 360
$$

$$
S_t = \begin{cases}
[0.0,\, 0.2] & \text{if } S_{bg} > 0.5 \quad \text{(suppress chromatic vibration)} \\
[0.8,\, 1.0] & \text{if } S_{bg} \leq 0.5 \quad \text{(increase chroma contrast)}
\end{cases}
$$

Hue rotation has negligible effect once $S_{bg} < 0.15$.

Perceptual difference, CIE76 form over CIELAB:

$$
\Delta E = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}
$$

| $\Delta E$ | Perception |
| --- | --- |
| $< 1$ | Imperceptible |
| $1$–$2$ | Perceptible on close inspection |
| $2$–$10$ | Perceptible at a glance |
| $> 50$ | More different than similar |

CIEDE2000 is the accurate successor and is the recommended form. HSL and RGB distances are not valid for $\Delta E$.

## Alternative Cylindrical Models

Present in [`hsl-and-hsv.md`](hsl-and-hsv.md) as background; none are used.

Polar chromaticity, an alternative to the hexagonal $H$ and $\Delta$ above:

$$
\alpha = \tfrac{1}{2}(2R - G - B), \qquad \beta = \tfrac{\sqrt{3}}{2}(G - B)
$$

$$
H_2 = \operatorname{atan2}(\beta, \alpha), \qquad C_2 = \sqrt{\alpha^2 + \beta^2}
$$

$H_2$ tracks $H$ to within $1.12°$, but $C_2$ diverges from $C$ by up to $13.4\%$ midway between hexagon corners.

Three incompatible definitions of "saturation":

$$
S_V = \frac{C}{V}, \qquad S_L = \frac{C}{1 - \lvert 2L - 1 \rvert}, \qquad S_I = 1 - \frac{m}{I}
$$

Each is $0$ at its respective degenerate case ($V = 0$; $L \in \{0, 1\}$; $I = 0$). $S_V$ and $S_I$ approximate the psychometric sense — chroma relative to a color's own lightness — while $S_L$ does not.

Interconversion:

$$
V = L + S_L \min(L,\, 1 - L), \qquad L = V\left(1 - \frac{S_V}{2}\right), \qquad H_V = H_L
$$

Luma-preserving reconstruction from $(H, C, Y'_{601})$ uses the same $(R_1, G_1, B_1)$ sector table as HSL → RGB, offset to match luma:

$$
m = Y'_{601} - (0.30 R_1 + 0.59 G_1 + 0.11 B_1)
$$

## Perceptual Extension

Proposed only — see [`oklab-and-chromatic-vibration.md`](oklab-and-chromatic-vibration.md) for the matrices, derivation, and caveats. Summarized here for completeness:

$$
L_r = \tfrac{1}{2}\left(k_3 L - k_1 + \sqrt{(k_3 L - k_1)^2 + 4 k_2 k_3 L}\right), \qquad k_1 = 0.206,\; k_2 = 0.03,\; k_3 = \tfrac{1 + k_1}{1 + k_2}
$$

$$
C = \sqrt{a^2 + b^2}, \qquad h = \operatorname{atan2}(b, a)
$$

$$
V = \frac{\min(C_1, C_2)}{C_{\text{ref}}} \cdot \frac{1 - \cos(\Delta h)}{2} \cdot \max\!\left(0,\; 1 - \frac{\lvert \Delta L_r \rvert}{\tau}\right)
$$

## Constants

| Symbol | Value | Role | Location |
| --- | --- | --- | --- |
| — | $255$ | Channel maximum | `hexadecimal.ts`, `complement.ts` |
| $K$ | $115$ | Uniform lightness shift | `complement.ts` · `RGB_CHANGE` |
| — | $0.04045$, $12.92$, $0.055$, $1.055$, $2.4$ | sRGB transfer function | documented only |
| — | $0.2126$, $0.7152$, $0.0722$ | Rec. 709 luminance weights | documented only |
| — | $0.05$ | Contrast-ratio flare term | documented only |
| — | $0.30$, $0.59$, $0.11$ | Rec. 601 luma weights | documented only |
| $k_1, k_2$ | $0.206$, $0.03$ | $L_r$ toe | proposed |
| $\tau$ | ~$0.20$ | Vibration luminance cutoff | proposed, unfitted |

## Documentation Drift

[`complement-formulas.md`](complement-formulas.md) specifies $K$ as randomized once at module load, $K = 113 + \operatorname{round}(\operatorname{rand}() \times 4) \in \{113, \ldots, 117\}$. `complement.ts` fixes $K = 115$ — the observed mean of that spread — so the mirror is deterministic and importing the module has no side effect. The formula note is stale on this point.

* This file was generated by AI and may not be accurate.
