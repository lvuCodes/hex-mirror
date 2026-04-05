# Color Contrast Optimization Formulas

---

## 1. Hex to Linear RGB

Convert each hex channel to a 0–1 decimal, then gamma-expand:

```
c = channel value (0–255)
c_srgb = c / 255

if c_srgb <= 0.04045:
    c_linear = c_srgb / 12.92
else:
    c_linear = ((c_srgb + 0.055) / 1.055) ^ 2.4
```

Apply to R, G, B independently.

---

## 2. Relative Luminance (WCAG)

Using linear RGB channels:

```
L = 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear
```

Range: 0 (black) to 1 (white).

---

## 3. Contrast Ratio (WCAG)

Given two colors with luminances L1 (lighter) and L2 (darker):

```
ratio = (L1 + 0.05) / (L2 + 0.05)
```

| Threshold | Requirement |
|---|---|
| 3:1 | WCAG AA, large text |
| 4.5:1 | WCAG AA, normal text |
| 7:1 | WCAG AAA, normal text |

---

## 4. RGB to HSL

Given R, G, B in range 0–1:

```
cmax = max(R, G, B)
cmin = min(R, G, B)
delta = cmax - cmin

L = (cmax + cmin) / 2

S = 0                                if delta == 0
S = delta / (1 - |2L - 1|)          otherwise

H = 0                                if delta == 0
H = 60 * ((G - B) / delta mod 6)    if cmax == R
H = 60 * ((B - R) / delta + 2)      if cmax == G
H = 60 * ((R - G) / delta + 4)      if cmax == B
```

H in degrees (0–360), S and L in range 0–1 (or 0–100%).

---

## 5. HSL to RGB

Given H (0–360), S (0–1), L (0–1):

```
C = (1 - |2L - 1|) * S
X = C * (1 - |H/60 mod 2 - 1|)
m = L - C/2

(R', G', B') by H sector:
  0  <= H < 60:   (C, X, 0)
  60 <= H < 120:  (X, C, 0)
  120 <= H < 180: (0, C, X)
  180 <= H < 240: (0, X, C)
  240 <= H < 300: (X, 0, C)
  300 <= H < 360: (C, 0, X)

R = (R' + m) * 255
G = (G' + m) * 255
B = (B' + m) * 255
```

---

## 6. HSL Optimization Rules

Given background HSL (H_bg, S_bg, L_bg), derive text color HSL (H_t, S_t, L_t):

**Lightness**
```
if L_bg > 0.5:  L_t = 0.05–0.15    (dark text on light background)
if L_bg <= 0.5: L_t = 0.85–0.95    (light text on dark background)
```

**Hue**
```
H_t = (H_bg + 180) mod 360
```

Exception: if S_bg < 0.15 (near-neutral), hue rotation is optional as it has negligible effect.

**Saturation**
```
if S_bg > 0.5:  S_t = 0.0–0.2      (desaturate to prevent chromatic vibration)
if S_bg <= 0.5: S_t = 0.8–1.0      (saturate to increase chroma contrast)
```

---

## 7. Delta-E (Perceptual Color Difference)

For precise perceptual distance, convert to **CIELAB** (L\*, a\*, b\*) and compute:

```
dE = sqrt((L2* - L1*)^2 + (a2* - a1*)^2 + (b2* - b1*)^2)
```

This is **CIE76**. Improved versions: **CIE94**, **CIEDE2000** (most perceptually accurate).

| dE value | Perception |
|---|---|
| < 1 | Imperceptible |
| 1–2 | Perceptible on close inspection |
| 2–10 | Perceptible at a glance |
| > 50 | Colors are more different than similar |

Delta-E operates in Lab/OKLCH space; HSL is not perceptually uniform and should not be used for delta-E calculations.
