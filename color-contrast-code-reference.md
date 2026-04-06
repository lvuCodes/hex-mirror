# Color Contrast Optimization - Code Reference

---

## 1. Hex to Linear RGB

$$
c_{\text{sRGB}} = \frac{c}{255}
$$

$$
c_{\text{linear}} = \begin{cases}
\dfrac{c_{\text{sRGB}}}{12.92} & \text{if } c_{\text{sRGB}} \leq 0.04045 \\[10pt]
\left(\dfrac{c_{\text{sRGB}} + 0.055}{1.055}\right)^{2.4} & \text{otherwise}
\end{cases}
$$

**Variables**

| Symbol | Name | Type/Range |
|---|---|---|
| $c$ | Raw channel value | integer, 0–255 |
| $c_{\text{sRGB}}$ | Normalized channel | float, 0–1 |
| $c_{\text{linear}}$ | Gamma-expanded channel | float, 0–1 |

**Pseudocode**

```
function toLinear(c: number): number {
  const sRGB = c / 255
  if (sRGB <= 0.04045)
    return sRGB / 12.92
  else
    return ((sRGB + 0.055) / 1.055) ** 2.4
}

// call once per channel
R_linear = toLinear(R)
G_linear = toLinear(G)
B_linear = toLinear(B)
```

**Gotchas**
- Apply to each channel independently
- Input is 0–255 integer; output is 0–1 float
- Use `** 2.4` for exponentiation (`Math.pow(x, 2.4)` in JS)

---

## 2. Relative Luminance (WCAG)

$$
L = 0.2126\, R_{\text{linear}} + 0.7152\, G_{\text{linear}} + 0.0722\, B_{\text{linear}}
$$

**Variables**

| Symbol | Name | Type/Range |
|---|---|---|
| $L$ | Relative luminance | float, 0–1 |
| $R_{\text{linear}}$ | Linear red channel | float, 0–1 |
| $G_{\text{linear}}$ | Linear green channel | float, 0–1 |
| $B_{\text{linear}}$ | Linear blue channel | float, 0–1 |

**Pseudocode**

```
function getLuminance(R: number, G: number, B: number): number {
  return 0.2126 * toLinear(R) + 0.7152 * toLinear(G) + 0.0722 * toLinear(B)
}
```

**Gotchas**
- Use linear RGB, not raw 0–255 values
- Coefficients are fixed WCAG constants — do not change them

---

## 3. Contrast Ratio (WCAG)

$$
\text{ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}
$$

**Variables**

| Symbol | Name | Type/Range |
|---|---|---|
| $L_1$ | Luminance of lighter color | float, 0–1 |
| $L_2$ | Luminance of darker color | float, 0–1 |
| $\text{ratio}$ | Contrast ratio | float, 1–21 |

**Pseudocode**

```
function getContrastRatio(L_bg: number, L_text: number): number {
  const lighter = Math.max(L_bg, L_text)
  const darker = Math.min(L_bg, L_text)
  return (lighter + 0.05) / (darker + 0.05)
}
```

**Gotchas**
- Always divide larger by smaller — sort before dividing
- Result of 1 = no contrast, 21 = max contrast (black on white)
- WCAG AA normal text minimum: 4.5

---

## 4. RGB to HSL

$$
C_{\max} = \max(R, G, B), \quad C_{\min} = \min(R, G, B), \quad \Delta = C_{\max} - C_{\min}
$$

$$
L = \frac{C_{\max} + C_{\min}}{2}
$$

$$
S = \begin{cases}
0 & \text{if } \Delta = 0 \\[6pt]
\dfrac{\Delta}{1 - |2L - 1|} & \text{otherwise}
\end{cases}
$$

$$
H = \begin{cases}
0 & \text{if } \Delta = 0 \\[6pt]
60 \times \left(\dfrac{G - B}{\Delta} \bmod 6\right) & \text{if } C_{\max} = R \\[10pt]
60 \times \left(\dfrac{B - R}{\Delta} + 2\right) & \text{if } C_{\max} = G \\[10pt]
60 \times \left(\dfrac{R - G}{\Delta} + 4\right) & \text{if } C_{\max} = B
\end{cases}
$$

**Variables**

| Symbol | Name | Type/Range |
|---|---|---|
| $R, G, B$ | RGB channels | float, 0–1 (divide raw by 255 first) |
| $C_{\max}$ | Largest channel value | float, 0–1 |
| $C_{\min}$ | Smallest channel value | float, 0–1 |
| $\Delta$ | Channel range | float, 0–1 |
| $L$ | Lightness | float, 0–1 |
| $S$ | Saturation | float, 0–1 |
| $H$ | Hue | float, 0–360 |

**Pseudocode**

```
function rgbToHsl(R255: number, G255: number, B255: number): [H, S, L] {
  const R = R255 / 255
  const G = G255 / 255
  const B = B255 / 255

  const Cmax = Math.max(R, G, B)
  const Cmin = Math.min(R, G, B)
  const delta = Cmax - Cmin

  const L = (Cmax + Cmin) / 2

  const S = delta === 0 ? 0 : delta / (1 - Math.abs(2 * L - 1))

  let H = 0
  if (delta !== 0) {
    if (Cmax === R) H = 60 * (((G - B) / delta) % 6)
    if (Cmax === G) H = 60 * ((B - R) / delta + 2)
    if (Cmax === B) H = 60 * ((R - G) / delta + 4)
  }

  if (H < 0) H += 360

  return [H, S, L]
}
```

**Gotchas**
- Input RGB must be 0–1 (divide by 255 first)
- H can go negative from the mod — add 360 if `H < 0`
- JS `%` is remainder not true modulo — negative values stay negative

---

## 5. HSL to RGB

$$
C = (1 - |2L - 1|) \cdot S \qquad X = C \cdot \left(1 - \left|\frac{H}{60} \bmod 2 - 1\right|\right) \qquad m = L - \frac{C}{2}
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
R = (R' + m) \times 255, \quad G = (G' + m) \times 255, \quad B = (B' + m) \times 255
$$

**Variables**

| Symbol | Name | Type/Range |
|---|---|---|
| $H$ | Hue | float, 0–360 |
| $S$ | Saturation | float, 0–1 |
| $L$ | Lightness | float, 0–1 |
| $C$ | Chroma (intermediate) | float, 0–1 |
| $X$ | Secondary chroma (intermediate) | float, 0–1 |
| $m$ | Lightness offset (intermediate) | float, 0–1 |
| $R', G', B'$ | Pre-offset RGB (intermediate) | float, 0–1 |
| $R, G, B$ | Final RGB output | integer, 0–255 |

**Pseudocode**

```
function hslToRgb(H: number, S: number, L: number): [R, G, B] {
  const C = (1 - Math.abs(2 * L - 1)) * S
  const X = C * (1 - Math.abs((H / 60) % 2 - 1))
  const m = L - C / 2

  let R1 = 0, G1 = 0, B1 = 0

  if      (H < 60)  { R1 = C; G1 = X; B1 = 0 }
  else if (H < 120) { R1 = X; G1 = C; B1 = 0 }
  else if (H < 180) { R1 = 0; G1 = C; B1 = X }
  else if (H < 240) { R1 = 0; G1 = X; B1 = C }
  else if (H < 300) { R1 = X; G1 = 0; B1 = C }
  else              { R1 = C; G1 = 0; B1 = X }

  return [
    Math.round((R1 + m) * 255),
    Math.round((G1 + m) * 255),
    Math.round((B1 + m) * 255),
  ]
}
```

**Gotchas**
- $C$, $X$, $m$ are intermediate values — not saved, just used to compute RGB
- Multiply by 255 and round at the end to get integer output
- Use `Math.abs((H / 60) % 2 - 1)` carefully — JS `%` on floats can give unexpected results near boundaries

---

## 6. HSL Optimization Rules

$$
L_t = \begin{cases}
[0.05,\, 0.15] & \text{if } L_{bg} > 0.5 \\
[0.85,\, 0.95] & \text{if } L_{bg} \leq 0.5
\end{cases}
\qquad
H_t = (H_{bg} + 180) \bmod 360
\qquad
S_t = \begin{cases}
[0.0,\, 0.2] & \text{if } S_{bg} > 0.5 \\
[0.8,\, 1.0] & \text{if } S_{bg} \leq 0.5
\end{cases}
$$

**Variables**

| Symbol | Name | Type/Range |
|---|---|---|
| $L_{bg}$ | Background lightness | float, 0–1 |
| $L_t$ | Text lightness (output) | float, 0–1 |
| $H_{bg}$ | Background hue | float, 0–360 |
| $H_t$ | Text hue (output) | float, 0–360 |
| $S_{bg}$ | Background saturation | float, 0–1 |
| $S_t$ | Text saturation (output) | float, 0–1 |

**Pseudocode**

```
function getOptimizedTextHSL(H_bg: number, S_bg: number, L_bg: number): [H, S, L] {
  const L_t = L_bg > 0.5 ? 0.1 : 0.9       // pick midpoint of range
  const H_t = (H_bg + 180) % 360
  const S_t = S_bg > 0.5 ? 0.1 : 0.9       // pick midpoint of range

  return [H_t, S_t, L_t]
}
```

**Gotchas**
- $L_t$ and $S_t$ are ranges — the pseudocode uses midpoints; adjust to taste
- Skip hue rotation if $S_{bg} < 0.15$ (near-neutral — hue has no effect)
- `% 360` keeps hue within 0–360 after adding 180

---

## 7. Delta-E (note only)

$$
\Delta E = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}
$$

**Variables**

| Symbol | Name |
|---|---|
| $L^*, a^*, b^*$ | CIELAB color space channels |
| $\Delta E$ | Perceptual color difference (higher = more different) |

**Implementation note:** Converting RGB to CIELAB requires an intermediate XYZ conversion step. Use a library (`chroma-js`, `culori`) rather than implementing manually. HSL is not perceptually uniform and cannot be used for $\Delta E$.
