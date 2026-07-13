# Color Contrast Optimization Formulas

---

## 1. Hex to Linear RGB

Convert each hex channel to a 0–1 decimal, then gamma-expand:

$$
c_{\text{sRGB}} = \frac{c}{255}
$$

$$
c_{\text{linear}} = \begin{cases}
\dfrac{c_{\text{sRGB}}}{12.92} & \text{if } c_{\text{sRGB}} \leq 0.04045 \\[10pt]
\left(\dfrac{c_{\text{sRGB}} + 0.055}{1.055}\right)^{2.4} & \text{otherwise}
\end{cases}
$$

Apply to $R$, $G$, $B$ independently.

---

## 2. Relative Luminance (WCAG)

$$
L = 0.2126\, R_{\text{linear}} + 0.7152\, G_{\text{linear}} + 0.0722\, B_{\text{linear}}
$$

Range: $0$ (black) to $1$ (white).

---

## 3. Contrast Ratio (WCAG)

Given two colors with luminances $L_1 \geq L_2$:

$$
\text{ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}
$$

| Threshold | Requirement           |
| --------- | --------------------- |
| 3:1       | WCAG AA, large text   |
| 4.5:1     | WCAG AA, normal text  |
| 7:1       | WCAG AAA, normal text |

---

## 4. RGB to HSL

Given $R, G, B \in [0, 1]$:

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

$H \in [0°, 360°)$, $\; S, L \in [0, 1]$

---

## 5. HSL to RGB

Given $H \in [0, 360)$, $\; S, L \in [0, 1]$:

$$
C = (1 - |2L - 1|) \cdot S
$$

$$
X = C \cdot \left(1 - \left|\frac{H}{60} \bmod 2 - 1\right|\right)
$$

$$
m = L - \frac{C}{2}
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

---

## 6. HSL Optimization Rules

Given background $( H_{bg},\, S_{bg},\, L_{bg} )$, derive text color $( H_t,\, S_t,\, L_t )$:

**Lightness**

$$
L_t = \begin{cases}
[0.05,\, 0.15] & \text{if } L_{bg} > 0.5 \\
[0.85,\, 0.95] & \text{if } L_{bg} \leq 0.5
\end{cases}
$$

**Hue**

$$
H_t = (H_{bg} + 180) \bmod 360
$$

Exception: if $S_{bg} < 0.15$, hue rotation has negligible effect.

**Saturation**

$$
S_t = \begin{cases}
[0.0,\, 0.2] & \text{if } S_{bg} > 0.5 \quad \text{(desaturate to prevent chromatic vibration)} \\
[0.8,\, 1.0] & \text{if } S_{bg} \leq 0.5 \quad \text{(saturate to increase chroma contrast)}
\end{cases}
$$

---

## 7. Delta-E (Perceptual Color Difference)

Convert to CIELAB $(L^*, a^*, b^*)$ and compute CIE76:

$$
\Delta E = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}
$$

| $\Delta E$ | Perception                             |
| ---------- | -------------------------------------- |
| $< 1$      | Imperceptible                          |
| $1$–$2$    | Perceptible on close inspection        |
| $2$–$10$   | Perceptible at a glance                |
| $> 50$     | Colors are more different than similar |

Improved versions: **CIE94**, **CIEDE2000** (most perceptually accurate). HSL is not perceptually uniform and should not be used for $\Delta E$ calculations.
