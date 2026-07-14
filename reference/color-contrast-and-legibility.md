# Color Contrast and Legibility

Reference on why two adjacent colors read comfortably or clash — the perceptual mechanisms behind harsh brightness, neon-on-neon "vibration," and general illegibility — plus the [hex-mirror](..) formulas that quantify and generate contrast, and an explanation of when those generated pairs succeed or fail.

## Overview

Whether two colors sit comfortably together, or one seems to burn against the other, comes down to three largely independent axes of difference:

- **Luminance contrast** — the difference in perceived brightness. This is the dominant factor in legibility.[^wcag-contrast]
- **Chromatic (hue) contrast** — how far apart the hues are on the color wheel.
- **Saturation** — how pure/vivid each color is; high saturation on both sides is what turns a hue difference into discomfort.

The core principle threaded through this whole note: **the eye reads edges primarily by luminance, not by hue.** A pair with strong hue contrast but little luminance contrast gives the visual system no stable edge to lock onto — that is the root cause of both the "uncomfortably bright" and the "vibrating" cases below.

## Uncomfortably Bright and Hard to Read

Discomfort ("this is too bright / it hurts to read") is produced by high luminance combined with high saturation, not by hue alone:

- **High saturation at high lightness** drives the cone signal hard with little to soften it. Pure, fully-saturated colors have no admixture of neutral to reduce the stimulus.
- **Over-contrast** is its own discomfort. Pure white on pure black (a 21:1 ratio, the maximum) can cause halation/glare and afterimage fatigue, especially for long-form reading — maximum contrast is not the same as maximum comfort.
- **Blue carries little luminance** (weighted at only `0.0722` in the luminance formula below), so saturated blue text on a dark ground can look sharp yet measure as dangerously low contrast — it strains because the eye cannot resolve the edge even though the hue difference "feels" large.
- **Saturated red/blue edges** additionally trigger the depth/vibration effects in the next section.

The practical fix is to reduce one variable rather than all of them: keep the hue difference but **desaturate or shift the lightness of one side**, so the eye gets a clean luminance edge without being over-driven.

## Chromatic Vibration (Neon-on-Neon)

The neon-green-on-neon-pink effect has a name — several overlapping ones:

- **Simultaneous contrast** — the classic term (Josef Albers, *Interaction of Color*[^albers]): each color pushes its neighbor's appearance toward its own complement, so the two shove against each other perceptually.[^simcontrast]
- **Color vibration / optical vibration** — the specific case where two **highly saturated, near-complementary hues at similar luminance** are placed edge to edge. With no luminance edge to anchor on, the boundary appears to shimmer, flicker, or "buzz."[^simcontrast]

Two mechanisms combine to produce it:

- **Equal luminance, opponent hues.** The retina's opponent channels (red–green, blue–yellow) receive maximally conflicting signals, while the luminance channel sees a flat, edgeless field. The brain cannot settle a crisp boundary, so the edge appears unstable.
- **Chromatic aberration in the eye.** The eye's lens focuses different wavelengths at slightly different points; saturated complementary edges produce colored fringing the visual system cannot fully correct.[^aberration] For red/blue specifically this becomes **chromostereopsis** — red is refracted differently from blue and appears to float at a different depth, so red text on a blue ground (or vice versa) seems to hover and vibrate.[^chromostereo][^chromostereo-reversal]

Neon green on neon pink is the textbook trigger: both maximally saturated, near-complementary in hue, and close in luminance — every condition for vibration at once. It is the deliberate basis of Op-art (Bridget Riley).

## General Illegibility

What makes any two colors hard to see on each other, as a checklist:

- **Insufficient luminance contrast** — the single biggest factor. If the two relative luminances are close, text is hard to read *regardless of how different the hues are*.[^wcag-contrast]
- **Low perceptual difference (small ΔE)** — hues that are near-neighbors on the wheel and close in lightness are simply hard to tell apart.[^colordiff]
- **Both sides highly saturated** — converts a hue difference into vibration rather than clean contrast (previous section).
- **Chromatic aberration / chromostereopsis at edges** — saturated red↔blue and complementary pairs fringe and appear to shift depth.[^chromostereo]
- **Color-vision-deficiency failure modes** — red/green pairs that look distinct to typical vision can collapse to the same value for the ~8% of men with CVD; never rely on hue difference alone.
- **Scale dependence** — thin text and fine lines need far more contrast than large blocks, which is why WCAG sets a lower bar (3:1) for large text than for body text (4.5:1).[^wcag-contrast]

## Formulas

These are the quantitative tools from hex-mirror's [color-contrast-formulas.md](color-contrast-formulas.md) and [complement-formulas.md](complement-formulas.md). Each is framed by **what it solves for relative to a given input hex.**

### Measurement Formulas

**Relative luminance** — *solves for:* "how bright does the eye actually perceive this one hex?" It is not a transform but the measurement everything else rests on. The green weight dominates; blue barely registers.[^rel-lum]

$$
L = 0.2126\,R_{\text{lin}} + 0.7152\,G_{\text{lin}} + 0.0722\,B_{\text{lin}}
$$

(with each channel gamma-expanded from sRGB first). Range: `0` (black) to `1` (white).

**WCAG contrast ratio** — *solves for:* "given the input hex and a candidate second hex, is there enough **brightness** separation to read one on the other?" It measures only luminance separation and is blind to hue — which is exactly why a vividly different but equally-bright pair can still fail it.[^wcag-contrast]

$$
\text{ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}, \quad L_1 \geq L_2
$$

| Threshold | Requirement      |
| --------- | ---------------- |
| 3:1       | AA, large text   |
| 4.5:1     | AA, normal text  |
| 7:1       | AAA, normal text |

**ΔE (perceptual color difference)** — *solves for:* "are these two colors **distinguishable at all**, accounting for hue and chroma, not just brightness?" Computed in CIELAB, so a step means roughly the same perceived difference everywhere — unlike HSL/RGB distance.[^colordiff]

$$
\Delta E_{76} = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}
$$

CIE76 is the simple form; **CIEDE2000** is the perceptually accurate successor and should be preferred for real judgments.[^colordiff] Contrast ratio and ΔE answer different questions: a pair can have huge ΔE (very different colors) yet a poor contrast ratio (equal brightness) — that combination *is* the vibrating neon case.

### Generative Formulas — Why the Pairs Sometimes Work and Sometimes Do Not

hex-mirror derives a partner color from an input hex several ways. Whether the result is legible or clashes is governed by one thing: **does the transform change luminance, or only hue?** Transforms that flip or shift lightness create the luminance edge legibility needs; transforms that only rotate hue leave the two colors at the same brightness and produce vibration.

| Formula                                        | Transform vs. input hex                       | Solves for                                                               | Legibility outcome                                                                                                                     |
| ---------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Midpoint / negative** `mirror_midpoint`      | `255 − x` per channel — photographic negative | Opposite hue **and** inverted luminance at once                          | Usually strong — **except when the input is near mid-gray** (`L ≈ 0.5`), whose negative is also `≈ 0.5`, collapsing luminance contrast |
| **Lightness invert** `mirror_hsL`              | `L → 1 − L`, keep hue & saturation            | Pure **luminance** contrast, same hue family                             | Reliably legible (monochromatic light/dark pairing); no vibration                                                                      |
| **Hue rotate** `mirror_Hsl`                    | `H → 360 − H`, keep S & L                     | **Chromatic** contrast only, luminance untouched                         | Prone to vibration — equal luminance + saturated opposite hue is the neon-on-neon recipe                                               |
| **Full mirror** `mirror_HSL`                   | invert H, S, and L together                   | Both chroma **and** luminance contrast                                   | Generally best — opposite hue *and* opposite brightness                                                                                |
| **Hue + saturation invert** `mirror_HSl`       | `H → 360 − H`, `S → 1 − S`, hold `L` fixed    | Muted **chromatic** contrast — opposite, desaturated hue, luminance held | Weak — lightness unchanged leaves little luminance separation, though desaturating avoids the neon vibration                           |
| **Hue + lightness invert** `mirror_HsL`        | `H → 360 − H`, `L → 1 − L`, hold `S` fixed    | Opposite hue **and** brightness, saturation held                         | Legible — strong luminance edge; stays vivid, for when saturation is wanted                                                            |
| **Saturation + lightness invert** `mirror_hSL` | `S → 1 − S`, `L → 1 − L`, hold `H` fixed      | **Luminance** contrast in the same hue family, desaturated               | Legible and safe — luminance edge with muted chroma, no vibration                                                                      |
| **Saturation invert** `mirror_hSl`             | `S → 1 − S`, hold `H` and `L` fixed           | **Saturation** contrast only — hue and brightness held                   | Weakest — no luminance or hue change; low contrast, avoid for text                                                                     |
| **Sheets shift** `mirror_gsheet`               | uniform `±K` on all channels (`K ≈ 113–117`)  | A lighter/darker sibling — **luminance** contrast, hue roughly preserved | Works unless clamping at `0`/`255` flattens the shift                                                                                  |

The unifying rule: **a generated pair works when it lands enough luminance separation to clear a WCAG threshold, and fails when the two colors end up at similar luminance — even if their hues are opposite.** A hue-only complement looks "correct" on the color wheel yet reads badly on screen precisely because it solved for the wrong axis. The pattern holds across all seven mirror variants: the four that invert lightness (`mirror_hsL`, `mirror_HsL`, `mirror_hSL`, `mirror_HSL`) read cleanly, while the three that hold lightness fixed (`mirror_Hsl`, `mirror_HSl`, `mirror_hSl`) stay at similar luminance and risk vibration or low contrast.

### Optimization Rule

hex-mirror's HSL text-on-background rule encodes exactly this. Given a background `(H_bg, S_bg, L_bg)`, it derives text that guarantees luminance contrast *and* actively suppresses vibration:

- **Lightness** — push to the opposite extreme (`0.05–0.15` on light grounds, `0.85–0.95` on dark) → guarantees the luminance edge.
- **Hue** — rotate `180°` for chroma contrast (negligible effect once `S_bg < 0.15`).
- **Saturation** — **desaturate to `0.0–0.2` when the background is already saturated (`S_bg > 0.5`), specifically to prevent chromatic vibration**; only saturate up when the background is muted.

That saturation branch is the formula-level statement of this whole note: when both sides would be vivid, kill the saturation on one side rather than letting two neon fields fight.

## Practical Guidelines

- **Guarantee luminance contrast first** — hue difference is not a substitute; verify against the WCAG ratio.
- **Never pair two saturated near-complements at equal luminance** — desaturate or lighten/darken one side.
- **Avoid saturated red↔blue adjacency** for text — chromostereopsis makes it float and strain.
- **Do not rely on hue alone** — it fails for color-vision-deficient viewers and at small sizes.
- **Use ΔE (CIEDE2000), not HSL/RGB distance,** to judge whether two colors are perceptually distinct.
- **Maximum contrast ≠ maximum comfort** — soften pure-white-on-pure-black for long reading.

## Sources

[^wcag-contrast]: [Understanding SC 1.4.3: Contrast (Minimum) — W3C WAI](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
[^rel-lum]: [Relative luminance — WCAG WG (W3C)](https://www.w3.org/WAI/GL/wiki/Relative_luminance)
[^colordiff]: [Color difference (CIE76 / CIE94 / CIEDE2000) — Wikipedia](https://en.wikipedia.org/wiki/Color_difference)
[^simcontrast]: [Large enhancement of simultaneous color contrast by white flanking contours — PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7674406/)
[^albers]: [Interaction of Color (Josef Albers) — Wikipedia](https://en.wikipedia.org/wiki/Interaction_of_Color)
[^aberration]: [Chromatic Aberration — StatPearls, NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/NBK597386/)
[^chromostereo]: [What Is Chromostereopsis and Why Does It Cause Eye Strain? — ScienceInsights](https://scienceinsights.org/what-is-chromostereopsis-and-why-does-it-cause-eye-strain/)
[^chromostereo-reversal]: [Reversals of the colour-depth illusion explained by ocular chromatic aberration — PubMed](https://pubmed.ncbi.nlm.nih.gov/7483309/)

* This file was generated by AI and may not be accurate.