> Source: https://en.wikipedia.org/wiki/HSL_and_HSV

# HSL and HSV

![[img/hsl-hsv-models.png|600]]

*Fig. 1. HSL (a–d) and HSV (e–h). Above (a, e): cut-away three-dimensional models of each. Below: two-dimensional plots showing two of a model's three parameters at once, holding the other constant: cylindrical shells (b, f) of constant saturation, in this case the outside surface of each cylinder; horizontal cross-sections (c, g) of constant HSL lightness or HSV value, in this case the slices halfway down each cylinder; and rectangular vertical cross-sections (d, h) of constant hue, in this case of hues 0° red and its complement 180° cyan.*

**HSL** and **HSV** are the two most common [cylindrical-coordinate](https://en.wikipedia.org/wiki/Cylindrical_coordinate_system) representations of points in an [RGB color model](https://en.wikipedia.org/wiki/RGB_color_model). The two representations rearrange the geometry of RGB in an attempt to be more intuitive and [perceptually](https://en.wikipedia.org/wiki/Color_vision) relevant than the [cartesian](https://en.wikipedia.org/wiki/Cartesian_coordinate_system) (cube) representation. Developed in the 1970s for [computer graphics](https://en.wikipedia.org/wiki/Computer_graphics) applications, HSL and HSV are used today in [color pickers](https://en.wikipedia.org/wiki/Color_tool), in [image editing](https://en.wikipedia.org/wiki/Image_editing) software, and less commonly in [image analysis](https://en.wikipedia.org/wiki/Image_analysis) and [computer vision](https://en.wikipedia.org/wiki/Computer_vision).

HSL stands for *hue*, *saturation*, and *lightness*, and is often also called **HLS**. HSV stands for *hue*, *saturation*, and *value*, and is also often called **HSB** ($B$ for *brightness*). A third model, common in computer vision applications, is **HSI**, for *hue*, *saturation*, and *intensity*. However, while typically consistent, these definitions are not standardized, and any of these abbreviations might be used for any of these three or several other related cylindrical models. (For technical definitions of these terms, see below.)

In each cylinder, the angle around the central vertical axis corresponds to "[hue](https://en.wikipedia.org/wiki/Hue)", the distance from the axis corresponds to "[saturation](https://en.wikipedia.org/wiki/Colorfulness)", and the distance along the axis corresponds to "[lightness](https://en.wikipedia.org/wiki/Lightness)", "value" or "[brightness](https://en.wikipedia.org/wiki/Brightness)". Note that while "hue" in HSL and HSV refers to the same attribute, their definitions of "saturation" differ dramatically. Because HSL and HSV are simple transformations of device-dependent RGB models, the physical colors they define depend on the colors of the red, green, and blue [primaries](https://en.wikipedia.org/wiki/Primary_color) of the device or of the particular RGB space, and on the [gamma correction](https://en.wikipedia.org/wiki/Gamma_correction) used to represent the amounts of those primaries. Each unique RGB device therefore has unique HSL and HSV spaces to accompany it, and numerical HSL or HSV values describe a different color for each basis RGB space.

Both of these representations are used widely in computer graphics, and one or the other of them is often more convenient than RGB, but both are also criticized for not adequately separating color-making attributes, or for their lack of perceptual uniformity. Other more computationally intensive models, such as [CIELAB](https://en.wikipedia.org/wiki/CIELAB) or [CIECAM02](https://en.wikipedia.org/wiki/CIECAM02) are said to better achieve these goals.

## Basic principle

![[img/hsl-color-solid-cylinder-saturation-gray.png|400]]

*Fig. 2a: HSL cylinder*

![[img/hsv-color-solid-cylinder-saturation-gray.png|400]]

*Fig. 2b: HSV cylinder*

HSL and HSV are both cylindrical geometries (fig. 2), with hue, their angular dimension, starting at the [red](https://en.wikipedia.org/wiki/Red) [primary](https://en.wikipedia.org/wiki/Primary_color) at 0°, passing through the [green](https://en.wikipedia.org/wiki/Green) primary at 120° and the [blue](https://en.wikipedia.org/wiki/Blue) primary at 240°, and then wrapping back to red at 360°. In each geometry, the central vertical axis comprises the *neutral*, *achromatic*, or *gray* colors ranging, from top to bottom, white at lightness 1 (value 1) to black at lightness 0 (value 0).

In both geometries, the [additive](https://en.wikipedia.org/wiki/Additive_color) primary and [secondary colors](https://en.wikipedia.org/wiki/Secondary_color) – red, [yellow](https://en.wikipedia.org/wiki/Yellow), green, [cyan](https://en.wikipedia.org/wiki/Cyan), blue and [magenta](https://en.wikipedia.org/wiki/Magenta) – and linear mixtures between adjacent pairs of them, sometimes called *pure colors*, are arranged around the outside edge of the cylinder with saturation 1. These saturated colors have lightness 0.5 in HSL, while in HSV they have value 1. Mixing these pure colors with black – producing so-called *[shades](https://en.wikipedia.org/wiki/Tints_and_shades)* – leaves saturation unchanged. In HSL, saturation is also unchanged by *[tinting](https://en.wikipedia.org/wiki/Tints_and_shades)* with white, and only mixtures with both black and white – called *tones* – have saturation less than 1. In HSV, tinting alone reduces saturation.

![[img/hsl-color-solid-dblcone-chroma-gray.png|400]]

![[img/hsv-color-solid-cone-chroma-gray.png|400]]

*Fig. 3a–b. If we plot hue and (a) HSL lightness or (b) HSV value against chroma ([range](https://en.wikipedia.org/wiki/Range_(statistics)) of RGB values) rather than saturation (chroma over maximum chroma for that slice), the resulting solid is a [bicone](https://en.wikipedia.org/wiki/Bicone) or [cone](https://en.wikipedia.org/wiki/Cone), respectively, not a cylinder. Such diagrams often claim to represent HSL or HSV directly, with the chroma dimension confusingly labeled "saturation".*

Because these definitions of saturation – in which very dark (in both models) or very light (in HSL) near-neutral colors are considered fully saturated (for instance, `#005456` from the bottom right in the sliced HSL cylinder or `#d4ffff` from the top right) – conflict with the intuitive notion of color purity, often a [conic](https://en.wikipedia.org/wiki/Cone) or [biconic](https://en.wikipedia.org/wiki/Bicone) solid is drawn instead (fig. 3), with what this article calls *[chroma](https://en.wikipedia.org/wiki/Colorfulness)* as its radial dimension (equal to the [range](https://en.wikipedia.org/wiki/Range_(statistics)) of the RGB values), instead of saturation (where the saturation is equal to the chroma over the maximum chroma in that slice of the (bi)cone). Confusingly, such diagrams usually label this radial dimension "saturation", blurring or erasing the distinction between saturation and chroma. As described below, computing chroma is a helpful step in the derivation of each model. Because such an intermediate model – with dimensions hue, chroma, and HSV value or HSL lightness – takes the shape of a cone or bicone, HSV is often called the "hexcone model" while HSL is often called the "bi-hexcone model" (fig. 8).

## Motivation

![[img/tint-tone-shade.png|400]]

*Fig. 4: Painters long mixed colors by combining relatively bright pigments with black and white. Mixtures with white are called tints, mixtures with black are called shades, and mixtures with both are called tones. See [Tints and shades](https://en.wikipedia.org/wiki/Tint,_shade_and_tone).*

![[img/ostwald.png|400]]

*Fig. 5: This 1916 color model by German chemist [Wilhelm Ostwald](https://en.wikipedia.org/wiki/Wilhelm_Ostwald) exemplifies the "mixtures with white and black" approach, organizing 24 "pure" colors into a [hue circle](https://en.wikipedia.org/wiki/Color_circle), and colors of each hue into a triangle. The model thus takes the shape of a bicone.*

![[img/rgb-cube-show-lowgamma-cutout-a.png|400]]

*Fig. 6a: The RGB gamut can be arranged in a cube.*

![[img/rgb-cube-show-lowgamma-cutout-b.png|400]]

*Fig. 6b: The same image, with a portion removed for clarity*

![[img/tektronix-hsl-patent-diagram.png|400]]

*Fig. 7. Tektronix graphics terminals used the earliest commercial implementation of HSL, in 1979. This diagram, from a patent filed in 1983, shows the bicone geometry underlying the model.*

Most televisions, computer displays, and projectors produce colors by combining red, green, and blue light in varying intensities – the so-called [RGB](https://en.wikipedia.org/wiki/RGB_color_model) [additive](https://en.wikipedia.org/wiki/Additive_color) [primary colors](https://en.wikipedia.org/wiki/Primary_color). The resulting mixtures in [RGB color space](https://en.wikipedia.org/wiki/RGB_color_space) can reproduce a wide variety of colors (called a [gamut](https://en.wikipedia.org/wiki/Gamut)); however, the relationship between the constituent amounts of red, green, and blue light and the resulting color is unintuitive, especially for inexperienced users, and for users familiar with [subtractive color](https://en.wikipedia.org/wiki/Subtractive_color) mixing of paints or traditional artists' models based on tints and shades (fig. 4). Furthermore, neither additive nor subtractive color models define color relationships the same way the [human eye](https://en.wikipedia.org/wiki/Color_vision) does.

For example, imagine we have an RGB display whose color is controlled by three [sliders](https://en.wikipedia.org/wiki/Slider_(computing)) ranging from 0–255, one controlling the intensity of each of the red, green, and blue primaries. If we begin with a relatively colorful [orange](https://en.wikipedia.org/wiki/Orange_(colour)) `#D97621`, with [sRGB](https://en.wikipedia.org/wiki/SRGB) values $R$ = 217, $G$ = 118, $B$ = 33, and want to reduce its colorfulness by half to a less saturated orange `#BA845C`, we would need to drag the sliders to decrease $R$ by 31, increase $G$ by 24, and increase $B$ by 59, as pictured below.

Beginning in the 1950s, [color television](https://en.wikipedia.org/wiki/Color_television) broadcasts used a [compatible color](https://en.wikipedia.org/wiki/Color_television#Compatible_color) system whereby "[luminance](https://en.wikipedia.org/wiki/Luma_(video))" and "[chrominance](https://en.wikipedia.org/wiki/Chrominance)" signals were encoded separately, so that existing unmodified black-and-white televisions could still receive color broadcasts and show a monochrome image.

In an attempt to accommodate more traditional and intuitive color mixing models, computer graphics pioneers at [PARC](https://en.wikipedia.org/wiki/PARC_(company)) and [NYIT](https://en.wikipedia.org/wiki/New_York_Institute_of_Technology) introduced the HSV model for computer display technology in the mid-1970s, formally described by [Alvy Ray Smith](https://en.wikipedia.org/wiki/Alvy_Ray_Smith) in the August 1978 issue of [*Computer Graphics*](https://en.wikipedia.org/wiki/Computer_Graphics_(newsletter)). In the same issue, Joblove and Greenberg described the HSL model – whose dimensions they labeled *hue*, *relative chroma*, and *intensity* – and compared it to HSV (fig. 1). Their model was based more upon how colors are organized and conceptualized in [human vision](https://en.wikipedia.org/wiki/Color_vision) in terms of other color-making attributes, such as hue, lightness, and chroma; as well as upon traditional color mixing methods – e.g., in painting – that involve mixing brightly colored pigments with black or white to achieve lighter, darker, or less colorful colors.

The following year, 1979, at [SIGGRAPH](https://en.wikipedia.org/wiki/SIGGRAPH), [Tektronix](https://en.wikipedia.org/wiki/Tektronix) introduced graphics terminals using HSL for color designation, and the Computer Graphics Standards Committee recommended it in their annual status report (fig. 7). These models were useful not only because they were more intuitive than raw RGB values, but also because the conversions to and from RGB were extremely fast to compute: they could run in real time on the hardware of the 1970s. Consequently, these models and similar ones have become ubiquitous throughout image editing and [graphics software](https://en.wikipedia.org/wiki/Graphics_software) since then. Some of their uses are described below.

## Formal derivation

![[img/hsl-and-hsv.png|600]]

*Fig. 8. The geometric derivation of the cylindrical HSL and HSV representations of an RGB "colorcube".*

*Videos demonstrating the above geometric derivation for HSV (left) and HSL (right) as continuous deformations of the RGB cube*

### Color-making attributes

The dimensions of the HSL and HSV geometries – simple transformations of the not-perceptually-based RGB model – are not directly related to the [photometric](https://en.wikipedia.org/wiki/Photometry_(optics)) color-making attributes of the same names, as defined by scientists such as the [CIE](https://en.wikipedia.org/wiki/International_Commission_on_Illumination) or [ASTM](https://en.wikipedia.org/wiki/ASTM_International). Nonetheless, it is worth reviewing those definitions before leaping into the derivation of our models. For the definitions of color-making attributes which follow, see:

[Hue](https://en.wikipedia.org/wiki/Hue)

The "attribute of a visual sensation according to which an area appears to be similar to one of the [perceived colors](https://en.wikipedia.org/wiki/Unique_hues): red, yellow, green, and blue, or to a combination of two of them".

[Radiance](https://en.wikipedia.org/wiki/Radiance) ($L_{e,Ω}$)

The [radiant power](https://en.wikipedia.org/wiki/Radiant_flux) of light passing through a particular surface per unit [solid angle](https://en.wikipedia.org/wiki/Solid_angle) per unit projected area, measured in [SI units](https://en.wikipedia.org/wiki/International_System_of_Units) in [watt](https://en.wikipedia.org/wiki/Watt) per [steradian](https://en.wikipedia.org/wiki/Steradian) per [square metre](https://en.wikipedia.org/wiki/Square_metre) (W·sr<sup>−1</sup>·m<sup>−2</sup>).

[Luminance](https://en.wikipedia.org/wiki/Luminance) ($Y$ or $L_{v,Ω}$)

The radiance weighted by the effect of each wavelength on a typical human observer, measured in SI units in [candela per square meter](https://en.wikipedia.org/wiki/Candela_per_square_metre) (cd/m<sup>2</sup>). Often the term *luminance* is used for the [relative luminance](https://en.wikipedia.org/wiki/Relative_luminance), $Y$/$Y_{$n$}$, where $Y_{$n$}$ is the luminance of the reference [white point](https://en.wikipedia.org/wiki/White_point).

[Luma](https://en.wikipedia.org/wiki/Luma_(video)) ($Y'$)

The weighted sum of [gamma-corrected](https://en.wikipedia.org/wiki/Gamma_correction) $R'$, $G'$, and $B'$ values, and used in [Y′CbCr](https://en.wikipedia.org/wiki/YCbCr), for [JPEG](https://en.wikipedia.org/wiki/JPEG) compression and video transmission.

[Brightness (or value)](https://en.wikipedia.org/wiki/Brightness)

The "attribute of a visual sensation according to which an area appears to emit more or less light".

[Lightness](https://en.wikipedia.org/wiki/Lightness_(color))

The "brightness relative to the brightness of a similarly illuminated white".

[Colorfulness](https://en.wikipedia.org/wiki/Colorfulness)

The "attribute of a visual sensation according to which the perceived color of an area appears to be more or less chromatic".

[Chroma](https://en.wikipedia.org/wiki/Chrominance)

The "colorfulness relative to the brightness of a similarly illuminated white".

[Saturation](https://en.wikipedia.org/wiki/Colorfulness#Saturation)

The "colorfulness of a stimulus relative to its own brightness".

*Brightness* and *colorfulness* are absolute measures, which usually describe the [spectral distribution](https://en.wikipedia.org/wiki/Spectral_power_distribution) of light entering the eye, while *lightness* and *chroma* are measured relative to some white point, and are thus often used for descriptions of surface colors, remaining roughly constant even as brightness and colorfulness change with different [illumination](https://en.wikipedia.org/wiki/Computer_graphics_lighting). *Saturation* can be defined as either the ratio of colorfulness to brightness, or that of chroma to lightness.

### General approach

HSL, HSV, and related models can be derived via geometric strategies, or can be thought of as specific instances of a "generalized LHS model". The HSL and HSV model-builders took an RGB cube – with constituent amounts of red, green, and blue light in a color denoted $R$, $G$, $B$ [∈](https://en.wikipedia.org/wiki/%E2%88%88) [\[0, 1\]](https://en.wikipedia.org/wiki/Unit_interval) – and tilted it on its corner, so that black rested at the origin with white directly above it along the vertical axis, then measured the hue of the colors in the cube by their angle around that axis, starting with red at 0°. Then they came up with a characterization of brightness/value/lightness, and defined saturation to range from 0 along the axis to 1 at the most colorful point for each pair of other parameters. End-use software may use another scaling. For example, in [Microsoft Paint](https://en.wikipedia.org/wiki/Microsoft_Paint), hue runs from 0 to 239 rather than from 0 to 360 degrees, and saturation and lightness (termed "Lum") run from 0 to 240 instead of 0 to 1.

### Hue and chroma

![[img/hsl-hsv-hue-and-chroma.png|600]]

*Fig. 9. Both hue and chroma are defined based on the projection of the RGB cube onto a hexagon in the "chromaticity plane". Chroma is the relative size of the hexagon passing through a point, and hue is how far around that hexagon's edge the point lies.*

In each of our models, we calculate both *hue* and what this article will call [*chroma*](https://en.wikipedia.org/wiki/Colorfulness), after Joblove and Greenberg (1978), in the same way – that is, the hue of a color has the same numerical values in all of these models, as does its chroma. If we take our tilted RGB cube, and [project](https://en.wikipedia.org/wiki/3D_projection) it onto the "chromaticity [plane](https://en.wikipedia.org/wiki/Plane_(geometry))" [perpendicular](https://en.wikipedia.org/wiki/Perpendicular) to the neutral axis, our projection takes the shape of a hexagon, with red, yellow, green, cyan, blue, and magenta at its corners (fig. 9). *Hue* is roughly the angle of the [vector](https://en.wikipedia.org/wiki/Euclidean_vector) to a point in the projection, with red at 0°, while *chroma* is roughly the distance of the point from the origin.

More precisely, both hue and chroma in this model are defined with respect to the hexagonal shape of the projection. The *chroma* is the proportion of the distance from the origin to the edge of the hexagon. In the lower part of the adjacent diagram, this is the ratio of lengths *OP*/*OP′*, or alternatively the ratio of the radii of the two hexagons. This ratio is the difference between the largest and smallest values among $R$, $G$, or $B$ in a color. To make our definitions easier to write, we'll define these maximum, minimum, and chroma component values as $M$, $m$, and $C$, respectively.

$$M=\max(R,G,B)$$

$$m=\min(R,G,B)$$

$$C=\operatorname {range} (R,G,B)=M-m$$

These operations do not require R, G and B values to be normalized to a specific range (e.g. a range of 0–1 works as well as a range of 0–255).

To understand why chroma can be written as $M$ − $m$, notice that any neutral color, with $R$ = $G$ = $B$, projects onto the origin and so has 0 chroma. Thus if we add or subtract the same amount from all three of $R$, $G$, and $B$, we move vertically within our tilted cube, and do not change the projection. Therefore, any two colors of ($R$, $G$, $B$) and ($R$ − $m$, $G$ − $m$, $B$ − $m$) project on the same point, and have the same chroma. The chroma of a color with one of its components equal to zero ($m$ = 0) is simply the maximum of the other two components. This chroma is $M$ in the particular case of a color with a zero component, and $M$ − $m$ in general.

The *hue* is the proportion of the distance around the edge of the hexagon which passes through the projected point, originally measured on the range [0, 1] but now typically measured in [degrees](https://en.wikipedia.org/wiki/Degree_(angle)) [0°, 360°). For points which project onto the origin in the chromaticity plane (i.e., grays), hue is undefined. Mathematically, this definition of hue is written [piecewise](https://en.wikipedia.org/wiki/Piecewise):

$$H'={\begin{cases}\mathrm {undefined} ,&{\text{if }}C=0\\{\frac {G-B}{C}}{\bmod {6}},&{\text{if }}M=R\\{\frac {B-R}{C}}+2,&{\text{if }}M=G\\{\frac {R-G}{C}}+4,&{\text{if }}M=B\end{cases}}$$

$$H=60^{\circ }\times H'$$

Sometimes, neutral colors (i.e. with $C$ = 0) are assigned a hue of 0° for convenience of representation.

![[img/hsv-hexagons-to-circles.png|600]]

*Fig. 10. The definitions of hue and chroma in HSL and HSV have the effect of warping hexagons into circles.*

These definitions amount to a geometric warping of hexagons into circles: each side of the hexagon is mapped linearly onto a 60° arc of the circle (fig. 10). After such a transformation, hue is precisely the angle around the origin and chroma the distance from the origin: the angle and magnitude of the [vector](https://en.wikipedia.org/wiki/Euclidean_vector) pointing to a color.

![[img/hsv-polar-coord-hue-chroma.png|600]]

*Fig. 11. Constructing rectangular chromaticity coordinates α and β, and then transforming those into hue $H_{2}$ and chroma $C_{2}$ yields slightly different values than computing hexagonal hue $H$ and chroma $C$: compare the numbers in this diagram to those earlier in this section.*

Sometimes for image analysis applications, this hexagon-to-circle transformation is skipped, and *hue* and *chroma* (we'll denote these $H_{2}$ and $C_{2}$) are defined by the usual cartesian-to-polar coordinate transformations (fig. 11). The easiest way to derive those is via a pair of cartesian chromaticity coordinates which we'll call *α* and *β*:

$$\alpha =R-G\cdot \cos(60^{\circ })-B\cdot \cos(60^{\circ })={\tfrac {1}{2}}(2R-G-B)$$

$$\beta =G\cdot \sin(60^{\circ })-B\cdot \sin(60^{\circ })={\tfrac {\sqrt {3}}{2}}(G-B)$$

$$H_{2}=\operatorname {atan2} (\beta ,\alpha )$$

$$C_{2}=\operatorname {gmean} (\alpha ,\beta )={\sqrt {\alpha ^{2}+\beta ^{2}}}$$

(The [atan2](https://en.wikipedia.org/wiki/Atan2) function, a "two-argument arctangent", computes the angle from a cartesian coordinate pair.)

Notice that these two definitions of hue ($H$ and $H_{2}$) nearly coincide, with a maximum difference between them for any color of about 1.12° – which occurs at twelve particular hues, for instance $H$ = 13.38°, $H_{2}$ = 12.26° – and with $H$ = $H_{2}$ for every multiple of 30°. The two definitions of chroma ($C$ and $C_{2}$) differ more substantially: they are equal at the corners of our hexagon, but at points halfway between two corners, such as $H$ = $H_{2}$ = 30°, we have $C = 1$, but $C_{2}={\sqrt {\frac {3}{4}}}\approx 0.866,$ a difference of about 13.4%.

### Lightness

![[img/hsl-hsv-chroma-lightness-slices.png|600]]

*Fig. 12a–d. Four different possible "lightness" dimensions, plotted against chroma, for a pair of complementary hues. Each plot is a vertical cross-section of its three-dimensional color solid.*

While the definition of *hue* is relatively uncontroversial – it roughly satisfies the criterion that colors of the same perceived hue should have the same numerical hue – the definition of a *lightness* or *value* dimension is less obvious: there are several possibilities depending on the purpose and goals of the representation. Here are four of the most common (fig. 12; three of these are also shown in fig. 8):

- The simplest definition is just the [arithmetic mean](https://en.wikipedia.org/wiki/Arithmetic_mean), i.e. average, of the three components, in the HSI model called *intensity* (fig. 12a). This is simply the projection of a point onto the neutral axis – the vertical height of a point in our tilted cube. The advantage is that, together with Euclidean-distance calculations of hue and chroma, this representation preserves distances and angles from the geometry of the RGB cube.

$$I=\operatorname {avg} (R,G,B)={\tfrac {1}{3}}(R+G+B)$$

- In the HSV "hexcone" model, *value* is defined as the largest component of a color, our $M$ above (fig. 12b). This places all three primaries, and also all of the "secondary colors" – cyan, yellow, and magenta – into a plane with white, forming a [hexagonal pyramid](https://en.wikipedia.org/wiki/Hexagonal_pyramid) out of the RGB cube.

$$V=\max(R,G,B)=M$$

- In the HSL "bi-hexcone" model, *lightness* is defined as the average of the largest and smallest color components (fig. 12c), i.e. the [mid-range](https://en.wikipedia.org/wiki/Mid-range) of the RGB components. This definition also puts the primary and secondary colors into a plane, but a plane passing halfway between white and black. The resulting color solid is a double-cone similar to Ostwald's, shown above.

$$L=\operatorname {mid} (R,G,B)={\tfrac {1}{2}}(M+m)$$

- A more perceptually relevant alternative is to use [*luma*](https://en.wikipedia.org/wiki/Luma_(video)), $Y'$, as a lightness dimension (fig. 12d). Luma is the [weighted average](https://en.wikipedia.org/wiki/Weighted_average) of gamma-corrected $R$, $G$, and $B$, based on their contribution to perceived lightness, long used as the monochromatic dimension in color television broadcast. For [sRGB](https://en.wikipedia.org/wiki/SRGB), the [Rec. 709](https://en.wikipedia.org/wiki/Rec._709) primaries yield $Y'_{709}$, digital [NTSC](https://en.wikipedia.org/wiki/NTSC) uses $Y'_{601}$ according to [Rec. 601](https://en.wikipedia.org/wiki/Rec._601) and some other primaries are also in use which result in different coefficients.

$$Y'_{\text{601}}=0.299\cdot R+0.587\cdot G+0.114\cdot B$$

*(SDTV) 525 lines*

$$Y'_{\text{240}}=0.212\cdot R+0.701\cdot G+0.087\cdot B$$

*[(Adobe)](https://en.wikipedia.org/wiki/Adobe_RGB_color_space) also SMPTE 145*

$$Y'_{\text{709}}=0.2126\cdot R+0.7152\cdot G+0.0722\cdot B$$

*[(HDTV)](https://en.wikipedia.org/wiki/Rec._709)*

$$Y'_{\text{2020}}=0.2627\cdot R+0.6780\cdot G+0.0593\cdot B$$

*[(UHDTV, HDR)](https://en.wikipedia.org/wiki/Rec._2020) also Rec. 2100*

All four of these leave the neutral axis alone. That is, for colors with $R$ = $G$ = $B$, any of the four formulations yields a lightness equal to the value of $R$, $G$, or $B$.

For a graphical comparison, see fig. 13 below.

### Saturation

![[img/hsl-hsv-saturation-lightness-slices.png|600]]

*Fig. 14a–d. In both HSL and HSV, saturation is simply the chroma scaled to fill the interval [0, 1] for every combination of hue and lightness or value.*

When encoding colors in a hue/lightness/chroma or hue/value/chroma model (using the definitions from the previous two sections), not all combinations of lightness (or value) and chroma are meaningful: that is, half of the colors denotable using $H$ ∈ [0°, 360°), $C$ ∈ [0, 1], and $V$ ∈ [0, 1] fall outside the RGB gamut (the gray parts of the slices in figure 14). The creators of these models considered this a problem for some uses. For example, in a color selection interface with two of the dimensions in a rectangle and the third on a slider, half of that rectangle is made of unused space. Now imagine we have a slider for lightness: the user's intent when adjusting this slider is potentially ambiguous: how should the software deal with out-of-gamut colors? Or conversely, If the user has selected as colorful as possible a dark purple `#42007F`, and then shifts the lightness slider upward, what should be done: would the user prefer to see a lighter purple still as colorful as possible for the given hue and lightness `#7700E5`, or a lighter purple of exactly the same chroma as the original color `#7533B2` ?

To solve problems such as these, the HSL and HSV models scale the chroma so that it always fits into the range [0, 1] for every combination of hue and lightness or value, calling the new attribute *saturation* in both cases (fig. 14). To calculate either, simply divide the chroma by the maximum chroma for that value or lightness.

$$S_{V}={\begin{cases}0,&{\text{if }}V=0\\{\frac {C}{V}},&{\text{otherwise}}\end{cases}}$$

$$S_{L}={\begin{cases}0,&{\text{if }}L=1{\text{ or }}L=0\\{\frac {C}{1-|2L-1|}},&{\text{otherwise}}\end{cases}}$$

![[img/hsi-saturation-intensity-slices.png|600]]

*Fig. 15a–b. In HSI, saturation, shown in the slice on the right, is roughly the chroma relative to lightness. Also common is a model with dimensions $I$, $H_{2}$, $C_{2}$, shown in the slice on the left. Notice that the hue in these slices is the same as the hue above, but $H$ differs slightly from $H_{2}$.*

The HSI model commonly used for computer vision, which takes $H_{2}$ as a hue dimension and the component average $I$ ("intensity") as a lightness dimension, does not attempt to "fill" a cylinder by its definition of saturation. Instead of presenting color choice or modification interfaces to end users, the goal of HSI is to facilitate separation of shapes in an image. Saturation is therefore defined in line with the psychometric definition: chroma relative to lightness (fig. 15). See the Use in image analysis section of this article.

$$S_{I}={\begin{cases}0,&{\text{if }}I=0\\1-{\frac {m}{I}},&{\text{otherwise}}\end{cases}}$$

Using the same name for these three different definitions of saturation leads to some confusion, as the three attributes describe substantially different color relationships; in HSV and HSI, the term roughly matches the psychometric definition, of a chroma of a color relative to its own lightness, but in HSL it does not come close. Even worse, the word *saturation* is also often used for one of the measurements we call chroma above ($C$ or $C_{2}$).

### Examples

All parameter values shown below are given as values in the [interval](https://en.wikipedia.org/wiki/Interval_(mathematics)) [0, 1], except those for $H$ and $H_{2}$, which are in the interval [0°, 360°).

| Color | $R$ | $G$ | $B$ | $H$ | $H_2$ | $C$ | $C_2$ | $V$ | $L$ | $I$ | $Y'_{601}$ | $S_{HSV}$ | $S_{HSL}$ | $S_{HSI}$ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| #FFFFFF | 1.000 | 1.000 | 1.000 | N/A | N/A | 0.000 | 0.000 | 1.000 | 1.000 | 1.000 | 1.000 | 0.000 | 0.000 | 0.000 |
| #808080 | 0.500 | 0.500 | 0.500 | N/A | N/A | 0.000 | 0.000 | 0.500 | 0.500 | 0.500 | 0.500 | 0.000 | 0.000 | 0.000 |
| #000000 | 0.000 | 0.000 | 0.000 | N/A | N/A | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| #FF0000 | 1.000 | 0.000 | 0.000 | 0.0° | 0.0° | 1.000 | 1.000 | 1.000 | 0.500 | 0.333 | 0.299 | 1.000 | 1.000 | 1.000 |
| #BFBF00 | 0.750 | 0.750 | 0.000 | 60.0° | 60.0° | 0.750 | 0.750 | 0.750 | 0.375 | 0.500 | 0.664 | 1.000 | 1.000 | 1.000 |
| #008000 | 0.000 | 0.500 | 0.000 | 120.0° | 120.0° | 0.500 | 0.500 | 0.500 | 0.250 | 0.167 | 0.293 | 1.000 | 1.000 | 1.000 |
| #80FFFF | 0.500 | 1.000 | 1.000 | 180.0° | 180.0° | 0.500 | 0.500 | 1.000 | 0.750 | 0.833 | 0.850 | 0.500 | 1.000 | 0.400 |
| #8080FF | 0.500 | 0.500 | 1.000 | 240.0° | 240.0° | 0.500 | 0.500 | 1.000 | 0.750 | 0.667 | 0.557 | 0.500 | 1.000 | 0.250 |
| #BF40BF | 0.750 | 0.250 | 0.750 | 300.0° | 300.0° | 0.500 | 0.500 | 0.750 | 0.500 | 0.583 | 0.457 | 0.667 | 0.500 | 0.571 |
| #A0A424 | 0.628 | 0.643 | 0.142 | 61.8° | 61.5° | 0.501 | 0.494 | 0.643 | 0.393 | 0.471 | 0.581 | 0.779 | 0.638 | 0.699 |
| #411BEA | 0.255 | 0.104 | 0.918 | 251.1° | 250.0° | 0.814 | 0.750 | 0.918 | 0.511 | 0.426 | 0.242 | 0.887 | 0.832 | 0.756 |
| #1EAC41 | 0.116 | 0.675 | 0.255 | 134.9° | 133.8° | 0.559 | 0.504 | 0.675 | 0.396 | 0.349 | 0.460 | 0.828 | 0.707 | 0.667 |
| #F0C80E | 0.941 | 0.785 | 0.053 | 49.5° | 50.5° | 0.888 | 0.821 | 0.941 | 0.497 | 0.593 | 0.748 | 0.944 | 0.893 | 0.911 |
| #B430E5 | 0.704 | 0.187 | 0.897 | 283.7° | 284.8° | 0.710 | 0.636 | 0.897 | 0.542 | 0.596 | 0.423 | 0.792 | 0.775 | 0.686 |
| #ED7651 | 0.931 | 0.463 | 0.316 | 14.3° | 13.2° | 0.615 | 0.556 | 0.931 | 0.624 | 0.570 | 0.586 | 0.661 | 0.817 | 0.446 |
| #FEF888 | 0.998 | 0.974 | 0.532 | 56.9° | 57.4° | 0.466 | 0.454 | 0.998 | 0.765 | 0.835 | 0.931 | 0.467 | 0.991 | 0.363 |
| #19CB97 | 0.099 | 0.795 | 0.591 | 162.4° | 163.4° | 0.696 | 0.620 | 0.795 | 0.447 | 0.495 | 0.564 | 0.875 | 0.779 | 0.800 |
| #362698 | 0.211 | 0.149 | 0.597 | 248.3° | 247.3° | 0.448 | 0.420 | 0.597 | 0.373 | 0.319 | 0.219 | 0.750 | 0.601 | 0.533 |
| #7E7EB8 | 0.495 | 0.493 | 0.721 | 240.5° | 240.4° | 0.228 | 0.227 | 0.721 | 0.607 | 0.570 | 0.520 | 0.316 | 0.290 | 0.135 |

## Use in end-user software

![[img/hsl-hsv-colorpickers.png|600]]

*Fig 16a–g. By the 1990s, HSL and HSV color selection tools were ubiquitous. The screenshots above are taken from: SGI [IRIX](https://en.wikipedia.org/wiki/IRIX) 5, c. 1995;[Adobe Photoshop](https://en.wikipedia.org/wiki/Adobe_Photoshop), c. 1990;IBM [OS/2 Warp](https://en.wikipedia.org/wiki/OS/2#The_%22Warp%22_years) 3, c. 1994;Apple Macintosh [System 7](https://en.wikipedia.org/wiki/System_7), c. 1996;Fractal Design [Painter](https://en.wikipedia.org/wiki/Corel_Painter), c. 1993;Microsoft [Windows 3.1](https://en.wikipedia.org/wiki/Windows_3.1x), c. 1992;[NeXTSTEP](https://en.wikipedia.org/wiki/NeXTSTEP), c. 1995. These are undoubtedly based on earlier examples, stretching back to PARC and NYIT in the mid-1970s.*

The original purpose of HSL and HSV and similar models, and their most common current application, is in [color selection tools](https://en.wikipedia.org/wiki/Color_tool). At their simplest, some such color pickers provide three sliders, one for each attribute. Most, however, show a two-dimensional slice through the model, along with a slider controlling which particular slice is shown. The latter type of GUI exhibits great variety, because of the choice of cylinders, hexagonal prisms, or cones/bicones that the models suggest (see the diagram near the top of the page). Several color choosers from the 1990s are shown to the right, most of which have remained nearly unchanged in the intervening time: today, nearly every computer color chooser uses HSL or HSV, at least as an option. Some more sophisticated variants are designed for choosing whole sets of colors, basing their suggestions of compatible colors on the HSL or HSV relationships between them.

Most web applications needing color selection also base their tools on HSL or HSV, and pre-packaged open source color choosers exist for most major web front-end [frameworks](https://en.wikipedia.org/wiki/JavaScript_library). The [CSS 3](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) specification allows web authors to specify colors for their pages directly with HSL coordinates.

HSL and HSV are sometimes used to define gradients for [data visualization](https://en.wikipedia.org/wiki/Data_visualization), as in maps or medical images. For example, the popular [GIS](https://en.wikipedia.org/wiki/Geographic_information_system) program [ArcGIS](https://en.wikipedia.org/wiki/ArcGIS) historically applied customizable HSV-based gradients to numerical geographical data. Several studies have been done on color scheme choices for such data display, and the use of HSL&#x2D; and HSV&#x2D;based schemes has

![[img/xv-hsv-modification.png|400]]

*Fig. 17. [xv](https://en.wikipedia.org/wiki/Xv_(software))'s HSV-based color modifier.*

![[img/ps-2-5-hue-saturation-tool.png|400]]

*Fig. 18. The hue/saturation tool in [Photoshop](https://en.wikipedia.org/wiki/Adobe_Photoshop) 2.5, ca. 1992.*

*Fig. 19. [Avid](https://en.wikipedia.org/wiki/Avid_Technology)'s video color adjustment tool, based on HSL or a similar model. (image no longer available)*

[Image editing](https://en.wikipedia.org/wiki/Image_editing) software also commonly includes tools for adjusting colors with reference to HSL or HSV coordinates, or to coordinates in a model based on the "intensity" or luma defined above. In particular, tools with a pair of "hue" and "saturation" sliders are commonplace, dating to at least the late-1980s, but various more complicated color tools have also been implemented. For instance, the [Unix](https://en.wikipedia.org/wiki/Unix) image viewer and color editor [xv](https://en.wikipedia.org/wiki/Xv_(software)) allowed six user-definable hue ($H$) ranges to be rotated and resized, included a [dial](https://en.wikipedia.org/wiki/Dial_(measurement))-like control for saturation ($S_{HSV}$), and a [curves](https://en.wikipedia.org/wiki/Curve_(tonality))-like interface for controlling value ($V$) – see fig. 17. The image editor [Picture Window Pro](https://en.wikipedia.org/wiki/Picture_Window?action=edit&redlink=1) includes a "color correction" tool which affords complex remapping of points in a hue/saturation plane relative to either HSL or HSV space.

[Video editors](https://en.wikipedia.org/wiki/Non-linear_editing_system) also use these models. For example, both [Avid](https://en.wikipedia.org/wiki/Avid_Technology) and [Final Cut Pro](https://en.wikipedia.org/wiki/Final_Cut_Pro) include color tools based on HSL or a similar geometry for use adjusting the color in video. With the Avid tool, users pick a vector by clicking a point within the hue/saturation circle to shift all the colors at some lightness level (shadows, mid-tones, highlights) by that vector.

Since version 4.0, Adobe Photoshop's "Luminosity", "Hue", "Saturation", and "Color" [blend modes](https://en.wikipedia.org/wiki/Blend_modes) composite layers using a luma/chroma/hue color geometry. These have been copied widely, but several imitators use the HSL (e.g. [PhotoImpact](https://en.wikipedia.org/wiki/Ulead_PhotoImpact), [PaintShop Pro](https://en.wikipedia.org/wiki/PaintShop_Pro)) or HSV geometries instead. could use a ref about photoimpact, PSP, GIMP

## Use in image analysis

HSL, HSV, HSI, or related models are often used in [computer vision](https://en.wikipedia.org/wiki/Computer_vision) and [image analysis](https://en.wikipedia.org/wiki/Image_analysis) for [feature detection](https://en.wikipedia.org/wiki/Feature_detection_(computer_vision)) or [image segmentation](https://en.wikipedia.org/wiki/Segmentation_(image_processing)). The applications of such tools include object detection, for instance in [robot vision](https://en.wikipedia.org/wiki/Machine_vision); [object recognition](https://en.wikipedia.org/wiki/Object_recognition), for instance of [faces](https://en.wikipedia.org/wiki/Facial_recognition_system), [text](https://en.wikipedia.org/wiki/Optical_character_recognition), or [license plates](https://en.wikipedia.org/wiki/Automatic_number_plate_recognition); [content-based image retrieval](https://en.wikipedia.org/wiki/Content-based_image_retrieval); and [analysis of medical images](https://en.wikipedia.org/wiki/Medical_imaging).

For the most part, computer vision algorithms used on color images are straightforward extensions to algorithms designed for [grayscale](https://en.wikipedia.org/wiki/Grayscale) images, for instance [k-means](https://en.wikipedia.org/wiki/K-means_clustering) or [fuzzy clustering](https://en.wikipedia.org/wiki/Fuzzy_clustering) of pixel colors, or [canny](https://en.wikipedia.org/wiki/Canny_edge_detector) [edge detection](https://en.wikipedia.org/wiki/Edge_detection). At the simplest, each color component is separately passed through the same algorithm. It is important, therefore, that the [features](https://en.wikipedia.org/wiki/Feature_(computer_vision)) of interest can be distinguished in the color dimensions used. Because the $R$, $G$, and $B$ components of an object's color in a [digital image](https://en.wikipedia.org/wiki/Digital_image) are all correlated with the amount of light hitting the object, and therefore with each other, image descriptions in terms of those components make object discrimination difficult. Descriptions in terms of hue/lightness/chroma or hue/lightness/saturation are often more relevant.

Starting in the late 1970s, transformations like HSV or HSI were used as a compromise between effectiveness for segmentation and computational complexity. They can be thought of as similar in approach and intent to the neural processing used by human color vision, without agreeing in particulars: if the goal is object detection, roughly separating hue, lightness, and chroma or saturation is effective, but there is no particular reason to strictly mimic human color response. John Kender's 1976 master's thesis proposed the HSI model. Ohta et al. (1980) instead used a model made up of dimensions similar to those we have called $I$, *α*, and *β*. In recent years, such models have continued to see wide use, as their performance compares favorably with more complex models, and their computational simplicity remains compelling.

## Disadvantages

![[img/srgb-in-cielab.png|400]]

*Fig 20a: The [sRGB](https://en.wikipedia.org/wiki/SRGB) gamut mapped in CIELAB space. Notice that the lines pointing to the red, green, and blue primaries are not evenly spaced by [hue angle](https://en.wikipedia.org/wiki/Hue_angle), and are of unequal length. The primaries also have different $L$\* values.*

![[img/adobergb-in-cielab.png|400]]

*Fig 20b: The [Adobe RGB](https://en.wikipedia.org/wiki/Adobe_RGB_color_space) gamut mapped in CIELAB space. Also notice that these two RGB spaces have different gamuts, and thus will have different HSL and HSV representations.*

While HSL, HSV, and related spaces serve well enough to, for instance, choose a single color, they ignore much of the complexity of color appearance. Essentially, they trade off perceptual relevance for computation speed, from a time in computing history (high-end 1970s graphics workstations, or mid-1990s consumer desktops) when more sophisticated models would have been too computationally expensive.

HSL and HSV are simple transformations of RGB which preserve symmetries in the RGB cube unrelated to human perception, such that its $R$, $G$, and $B$ corners are equidistant from the neutral axis, and equally spaced around it. If we plot the RGB gamut in a more perceptually-uniform space, such as [CIELAB](https://en.wikipedia.org/wiki/CIELAB) (see below), it becomes immediately clear that the red, green, and blue primaries do not have the same lightness or chroma, or evenly spaced hues. Furthermore, different RGB displays use different primaries, and so have different gamuts. Because HSL and HSV are defined purely with reference to some RGB space, they are not [absolute color spaces](https://en.wikipedia.org/wiki/Absolute_color_space): to specify a color precisely requires reporting not only HSL or HSV values, but also the characteristics of the RGB space they are based on, including the [gamma correction](https://en.wikipedia.org/wiki/Gamma_correction) in use.

If we take an image and extract the hue, saturation, and lightness or value components, and then compare these to the components of the same name as defined by color scientists, we can quickly see the difference, perceptually. For example, examine the following images of a fire breather (fig. 13). The original is in the sRGB colorspace. CIELAB $L$* is a CIE-defined achromatic lightness quantity (dependent solely on the perceptually achromatic luminance $Y$, but not the mixed-chromatic components $X$ or $Z$, of the CIEXYZ colorspace from which the sRGB colorspace itself is derived), and it is plain that this appears similar in perceptual lightness to the original color image. Luma is roughly similar, but differs somewhat at high chroma, where it deviates most from depending solely on the true achromatic luminance ($Y$, or equivalently $L$*) and is influenced by the colorimetric chromaticity (*x,y*, or equivalently, *a*,b** of CIELAB). HSL $L$ and HSV $V$, by contrast, diverge substantially from perceptual lightness.

![[img/fire-breathing-2-luc-viatour.jpg|400]]

*Fig. 13a: Color photograph (sRGB colorspace)*

![[img/fire-breather-cielab-l.jpg|400]]

*Fig. 13b: CIELAB $L$\* (further transformed back to sRGB for consistent display)*

![[img/fire-breather-601-luma-y.jpg|400]]

*Fig. 13c: Rec. 601 luma $Y'$*

![[img/fire-breather-mean-r-g-b-i.jpg|400]]

*Fig. 13d: Component average: "intensity" $I$*

![[img/fire-breather-hsv-v.jpg|400]]

*Fig. 13e: HSV value $V$*

![[img/fire-breather-hsl-l.jpg|400]]

*Fig. 13f: HSL lightness $L$*

![[img/hsv-hues-cf-lch-hues.png|600]]

*Fig 20c: 12 points on the HSV color wheel in a [CIELAB](https://en.wikipedia.org/wiki/CIELAB) chroma plane, showing HSV's lack of uniformity in hue and saturation*

Though none of the dimensions in these spaces match their perceptual analogs, the *value* of HSV and the *saturation* of HSL are particular offenders. In HSV, the blue primary `#0000FF` and white `#FFFFFF` are held to have the same value, even though perceptually the blue primary has somewhere around 10% of the luminance of white (the exact fraction depends on the particular RGB primaries in use). In HSL, a mix of 100% red, 100% green, 90% blue – that is, a very light yellow `#FFFFE5` – is held to have the same saturation as the green primary `#00FF00`, even though the former color has almost no chroma or saturation by the conventional psychometric definitions. Such perversities led Cynthia Brewer, expert in color scheme choices for maps and information displays, to tell the [American Statistical Association](https://en.wikipedia.org/wiki/American_Statistical_Association):

> Computer science offers a few poorer cousins to these perceptual spaces that may also turn up in your software interface, such as HSV and HLS. They are easy mathematical transformations of RGB, and they seem to be perceptual systems because they make use of the hue–lightness/value–saturation terminology. But take a close look; don't be fooled. Perceptual color dimensions are poorly scaled by the color specifications that are provided in these and some other systems. For example, saturation and lightness are confounded, so a saturation scale may also contain a wide range of lightnesses (for example, it may progress from white to green which is a combination of both lightness and saturation). Likewise, hue and lightness are confounded so, for example, a saturated yellow and saturated blue may be designated as the same 'lightness' but have wide differences in perceived lightness. These flaws make the systems difficult to use to control the look of a color scheme in a systematic manner. If much tweaking is required to achieve the desired effect, the system offers little benefit over grappling with raw specifications in RGB or CMY.

If these problems make HSL and HSV problematic for choosing colors or color schemes, they make them much worse for image adjustment. HSL and HSV, as Brewer mentioned, confound perceptual color-making attributes, so that changing any dimension results in non-uniform changes to all three perceptual dimensions, and distorts all of the color relationships in the image. For instance, rotating the hue of a pure dark blue `#002BA6` toward green `#0087A6` will also reduce its perceived chroma, and increase its perceived lightness (the latter is grayer and lighter), but the same hue rotation will have the opposite impact on lightness and chroma of a lighter bluish-green – `#00D6AF` to `#00D639` (the latter is more colorful and slightly darker). In the example below (fig. 21), the image (a) is the original photograph of a [green turtle](https://en.wikipedia.org/wiki/Green_turtle). In the image (b), we have rotated the hue ($H$) of each color by −30°, while keeping HSV value and saturation or HSL lightness and saturation constant. In the image right (c), we make the same rotation to the HSL/HSV hue of each color, but then we force the CIELAB lightness ($L$*, a decent approximation of perceived lightness) to remain constant. Notice how the hue-shifted middle version without such a correction dramatically changes the perceived lightness relationships between colors in the image. In particular, the turtle's shell is much darker and has less contrast, and the background water is much lighter. Image (d) uses CIELAB to hue shift; the difference from (c) demonstrates the errors in hue and saturation.

![[img/hawaii-turtle-2.jpg|400]]

*Fig. 21a: Color photograph*

![[img/hawaii-turtle-hue-shifted.jpg|400]]

*Fig. 21b: HSL/HSV hue of each color shifted by −30°*

![[img/hawaii-turtle-hue-shifted-with-constant-l.jpg|400]]

*Fig. 21c: Hue shifted but CIELAB lightness ($L$\*) kept as in the original*

![[img/hawaii-turtle-2-hue-shifted-lch.jpg|400]]

*Fig. 21d: Hue shifted in CIELch(ab) color space by −30°*

Because hue is a circular quantity, represented numerically with a discontinuity at 360°, it is difficult to use in statistical computations or quantitative comparisons: analysis requires the use of [circular statistics](https://en.wikipedia.org/wiki/Directional_statistics). Furthermore, hue is defined piecewise, in 60° chunks, where the relationship of lightness, value, and chroma to $R$, $G$, and $B$ depends on the hue chunk in question. This definition introduces discontinuities, corners which can plainly be seen in horizontal slices of HSL or HSV.

Charles Poynton, digital video expert, lists the above problems with HSL and HSV in his *Color FAQ*, and concludes that:

> HSB and HLS were developed to specify numerical Hue, Saturation and Brightness (or Hue, Lightness and Saturation) in an age when users had to specify colors numerically. The usual formulations of HSB and HLS are flawed with respect to the properties of color vision. Now that users can choose colors visually, or choose colors related to other media (such as [PANTONE](https://en.wikipedia.org/wiki/Pantone)), or use perceptually-based systems like [L*u*v*](https://en.wikipedia.org/wiki/CIELUV) and [L*a*b*](https://en.wikipedia.org/wiki/CIELAB), HSB and HLS should be abandoned.

## Other cylindrical-coordinate color models

The creators of HSL and HSV were far from the first to imagine colors fitting into conic or spherical shapes, with neutrals running from black to white in a central axis, and hues corresponding to angles around that axis. Similar arrangements date back to the 18th century, and continue to be developed in the most modern and scientific models.

## Color conversion formulae

To convert from HSL or HSV to RGB, we essentially invert the steps listed above (as before, $R, G, B \in [0, 1]$). First, we compute chroma, by multiplying saturation by the maximum chroma for a given lightness or value. Next, we find the point on one of the bottom three faces of the RGB cube which has the same hue and chroma as our color (and therefore projects onto the same point in the chromaticity plane). Finally, we add equal amounts of $R$, $G$, and $B$ to reach the proper lightness or value.

### To RGB

#### HSL to RGB

Given a color with hue $H \in [0^\circ, 360^\circ)$, saturation $S_{L} \in [0, 1]$, and lightness $L \in [0, 1]$, we first find chroma:

$$C=(1-\left\vert 2L-1\right\vert )\times S_{L}$$

Then we can find a point $(R_{1}, G_{1}, B_{1})$ along the bottom three faces of the RGB cube, with the same hue and chroma as our color (using the intermediate value $X$ for the second largest component of this color):

$$H^{\prime }={\frac {H}{60^{\circ }}}$$

$$X=C\times (1-|H^{\prime }\;{\bmod {2}}-1|)$$

In the above equation, the notation $H^{\prime }\;{\bmod {2}}$ refers to the remainder of the [Euclidean division](https://en.wikipedia.org/wiki/Euclidean_division) of $H^{\prime }$ by 2. $H^{\prime }$ is not necessarily an integer.

$$(R_{1},G_{1},B_{1})={\begin{cases}(C,X,0)&{\text{if }}0\leq H^{\prime }<1\\(X,C,0)&{\text{if }}1\leq H^{\prime }<2\\(0,C,X)&{\text{if }}2\leq H^{\prime }<3\\(0,X,C)&{\text{if }}3\leq H^{\prime }<4\\(X,0,C)&{\text{if }}4\leq H^{\prime }<5\\(C,0,X)&{\text{if }}5\leq H^{\prime }<6\end{cases}}$$

When $H^{\prime }$ is an integer, the "neighboring" formula would yield the same result, as $X=0$ or $X=C$, as appropriate.

Finally, we can find $R$, $G$, and $B$ by adding the same amount to each component, to match lightness:

$$m=L-{\frac {C}{2}}$$

$$(R,G,B)=(R_{1}+m,G_{1}+m,B_{1}+m)$$

The polygonal piecewise functions can be somewhat simplified by clever use of minimum and maximum values as well as the remainder operation.

Given a color with hue $H\in [0^{\circ },360^{\circ }]$, saturation $S=S_{L}\in [0,1]$, and lightness $L\in [0,1]$, we first define the function:

$$f(n)=L-a\max(-1,\min(k-3,9-k,1))$$

where $k,n\in \mathbb {R} _{\geq 0}$ and:

$$k=\left(n+{\frac {H}{30^{\circ }}}\right){\bmod {1}}2$$

$$a=S_{L}\min(L,1-L)$$

And output R,G,B values (from $[0,1]^{3}$) are:

$$(R,G,B)=(f(0),f(8),f(4))$$

The above alternative formulas allow for shorter implementations. In the above formulas the $a{\bmod {b}}$ operation also returns the fractional part of the module e.g. $7.4{\bmod {6}}=1.4$, and $k\in [0,12)$.

The base shape $T(k)=t(n,H)=\max(\min(k-3,9-k,1),-1)$ is constructed as follows: $t_{1}=\min(k-3,9-k)$ is a "triangle" for which values greater or equal to −1 start from k=2 and end at k=10, and the highest point is at k=6. Then by $t_{2}=\min(t_{1},1)=\min(k-3,9-k,1)$ we change values bigger than 1 to equal 1. Then by $t=\max(t_{2},-1)$ we change values less than −1 to equal −1. At this point, we get something similar to the red shape from fig. 24 after a vertical flip (where the maximum is 1 and the minimum is −1). The R,G,B functions of $H$ use this shape transformed in the following way: modulo-shifted on $X$ (by $n$) (differently for R,G,B) scaled on $Y$ (by $-a$) and shifted on $Y$ (by $L$).

We observe the following shape properties (Fig. 24 can help to get an intuition about them):

$$t(n,H)=-t(n+6,H)$$

$$\min \ (t(n,H),t(n+4,H),t(n+8,H))=-1$$

$$\max \ (t(n,H),t(n+4,H),t(n+8,H))=+1$$

#### HSV to RGB

![[img/hsv-rgb-comparison.png|600]]

*Fig. 24. A graphical representation of RGB coordinates given values for HSV. This equation $V(1-S)=V-VS$ shows origin of marked vertical axis values.*

Given an HSV color with hue $H \in [0^\circ, 360^\circ)$, saturation $S_{V} \in [0, 1]$, and value $V \in [0, 1]$, we can use the same strategy. First, we find chroma:

$$C=V\times S_{V}$$

Then we can, again, find a point $(R_{1}, G_{1}, B_{1})$ along the bottom three faces of the RGB cube, with the same hue and chroma as our color (using the intermediate value $X$ for the second largest component of this color):

$$H^{\prime }={\frac {H}{60^{\circ }}}$$

$$X=C\times (1-|H^{\prime }{\bmod {2}}-1|)$$

$$(R_{1},G_{1},B_{1})={\begin{cases}(C,X,0)&{\text{if }}0\leq H^{\prime }<1\\(X,C,0)&{\text{if }}1\leq H^{\prime }<2\\(0,C,X)&{\text{if }}2\leq H^{\prime }<3\\(0,X,C)&{\text{if }}3\leq H^{\prime }<4\\(X,0,C)&{\text{if }}4\leq H^{\prime }<5\\(C,0,X)&{\text{if }}5\leq H^{\prime }<6\end{cases}}$$

As before, when $H^{\prime }$ is an integer, "neighboring" formulas would yield the same result.

Finally, we can find $R$, $G$, and $B$ by adding the same amount to each component, to match value:

$$m=V-C$$

$$(R,G,B)=(R_{1}+m,G_{1}+m,B_{1}+m)$$

Given a color with hue $H\in [0^{\circ },360^{\circ }]$, saturation $S=S_{V}\in [0,1]$, and value $V\in [0,1]$, first we define function:

$$f(n)=V-VS\max(0,\min(k,4-k,1))$$

where $k,n\in \mathbb {R} _{\geq 0}$ and:

$$k=\left(n+{\frac {H}{60^{\circ }}}\right){\bmod {6}}$$

And output R,G,B values (from $[0,1]^{3}$) are:

$$(R,G,B)=(f(5),f(3),f(1))$$

Above alternative equivalent formulas allow shorter implementation. In above formulas the $a{\bmod {b}}$ returns also fractional part of module e.g. the formula $7.4{\bmod {6}}=1.4$. The values of $k\in \mathbb {R} \land k\in [0,6)$. The base shape

$$t(n,H)=T(k)=\max(0,\min(k,4-k,1))$$

is constructed as follows: $t_{1}=\min(k,4-k)$ is "triangle" for which non-negative values starts from k=0, highest point at k=2 and "ends" at k=4, then we change values bigger than one to one by $t_{2}=\min(t_{1},1)=\min(k,4-k,1)$, then change negative values to zero by $t=\max(t2,0)$ – and we get (for $n=0$) something similar to green shape from Fig. 24 (which max value is 1 and min value is 0). The R,G,B functions of $H$ use this shape transformed in following way: modulo-shifted on $X$ (by $n$) (differently for R,G,B) scaled on $Y$ (by $-VS$) and shifted on $Y$ (by $V$). We observe following shape properties(Fig. 24 can help to get intuition about this):

$$t(n,H)=1-t(n+3,H)$$

$$\min(t(n,H),t(n+2,H),t(n+4,H))=0$$

$$\max(t(n,H),t(n+2,H),t(n+4,H))=1$$

#### HSI to RGB

Given an HSI color with hue $H \in [0^\circ, 360^\circ)$, saturation $S_{I} \in [0, 1]$, and intensity $I \in [0, 1]$, we can use the same strategy, in a slightly different order:

$$H^{\prime }={\frac {H}{60^{\circ }}}$$

$$Z=1-|H^{\prime }\;{\bmod {2}}-1|$$

$$C={\frac {3\cdot I\cdot S_{I}}{1+Z}}$$

$$X=C\cdot Z$$

Where $C$ is the chroma.

Then we can, again, find a point $(R_{1}, G_{1}, B_{1})$ along the bottom three faces of the RGB cube, with the same hue and chroma as our color (using the intermediate value $X$ for the second largest component of this color):

$$(R_{1},G_{1},B_{1})={\begin{cases}(0,0,0)&{\text{if }}H{\text{ is undefined}}\\(C,X,0)&{\text{if }}0\leq H^{\prime }\leq 1\\(X,C,0)&{\text{if }}1\leq H^{\prime }\leq 2\\(0,C,X)&{\text{if }}2\leq H^{\prime }\leq 3\\(0,X,C)&{\text{if }}3\leq H^{\prime }\leq 4\\(X,0,C)&{\text{if }}4\leq H^{\prime }\leq 5\\(C,0,X)&{\text{if }}5\leq H^{\prime }<6\end{cases}}$$

Overlap (when $H^{\prime }$ is an integer) occurs because two ways to calculate the value are equivalent: $X=0$ or $X=C$, as appropriate.

Finally, we can find $R$, $G$, and $B$ by adding the same amount to each component, to match lightness:

$$m=I\cdot (1-S_{I})$$

$$(R,G,B)=(R_{1}+m,G_{1}+m,B_{1}+m)$$

#### Luma, chroma and hue to RGB

Given a color with hue $H \in [0^\circ, 360^\circ)$, chroma $C \in [0, 1]$, and luma $Y′_{601} \in [0, 1]$, we can again use the same strategy. Since we already have $H$ and $C$, we can straightaway find our point $(R_{1}, G_{1}, B_{1})$ along the bottom three faces of the RGB cube:

$${\begin{aligned}H^{\prime }&={\frac {H}{60^{\circ }}}\\X&=C\times (1-|H^{\prime }{\bmod {2}}-1|)\end{aligned}}$$

$$(R_{1},G_{1},B_{1})={\begin{cases}(0,0,0)&{\text{if }}H{\text{ is undefined}}\\(C,X,0)&{\text{if }}0\leq H^{\prime }\leq 1\\(X,C,0)&{\text{if }}1\leq H^{\prime }\leq 2\\(0,C,X)&{\text{if }}2\leq H^{\prime }\leq 3\\(0,X,C)&{\text{if }}3\leq H^{\prime }\leq 4\\(X,0,C)&{\text{if }}4\leq H^{\prime }\leq 5\\(C,0,X)&{\text{if }}5\leq H^{\prime }<6\end{cases}}$$

Overlap (when $H^{\prime }$ is an integer) occurs because two ways to calculate the value are equivalent: $X=0$ or $X=C$, as appropriate.

Then we can find $R$, $G$, and $B$ by adding the same amount to each component, to match luma:

$$m=Y_{601}^{\prime }-(0.30R_{1}+0.59G_{1}+0.11B_{1})$$

$$(R,G,B)=(R_{1}+m,G_{1}+m,B_{1}+m)$$

### Interconversion

#### HSV to HSL

Given a color with hue $H_{V}\in [0^{\circ },360^{\circ })$, saturation $S_{V}\in [0,1]$, and value $V\in [0,1]$,

$$H_{L}=H_{V}$$

$$S_{L}={\begin{cases}0&{\text{if }}L=0{\text{ or }}L=1\\{\frac {V-L}{\min(L,1-L)}}&{\text{otherwise}}\\\end{cases}}$$

$$L=V\left(1-{\frac {S_{V}}{2}}\right)$$

#### HSL to HSV

Given a color with hue $H_{L}\in [0^{\circ },360^{\circ })$, saturation $S_{L}\in [0,1]$, and luminance $L\in [0,1]$,

$$H_{V}=H_{L}$$

$$S_{V}={\begin{cases}0&{\text{if }}V=0\\2\left(1-{\frac {L}{V}}\right)&{\text{otherwise}}\\\end{cases}}$$

$$V=L+S_{L}\min(L,1-L)$$

### From RGB

This is a reiteration of the previous conversion.

Value must be in range $R,G,B\in [0,1]$.

With maximum component (i. e. value)

$$X_{\text{max}}:=\max(R,G,B)=:V$$

and minimum component

$$X_{\text{min}}:=\min(R,G,B)=V-C$$

range (i. e. chroma)

$$C:=X_{\text{max}}-X_{\text{min}}=2(V-L)$$

and mid-range (i. e. lightness)

$$L:=\operatorname {mid} (R,G,B)={\frac {X_{\text{max}}+X_{\text{min}}}{2}}=V-{\frac {C}{2}}$$

we get common hue:

$$H:={\begin{cases}0,&{\text{if }}C=0\\60^{\circ }\cdot \left({\frac {G-B}{C}}\mod 6\right),&{\text{if }}V=R\\60^{\circ }\cdot \left({\frac {B-R}{C}}+2\right),&{\text{if }}V=G\\60^{\circ }\cdot \left({\frac {R-G}{C}}+4\right),&{\text{if }}V=B\end{cases}}$$

and distinct saturations:

$$S_{V}:={\begin{cases}0,&{\text{if }}V=0\\{\frac {C}{V}},&{\text{otherwise}}\end{cases}}$$

$$S_{L}:={\begin{cases}0,&{\text{if }}L=0{\text{ or }}L=1\\{\frac {C}{1-\left\vert 2V-C-1\right\vert }}={\frac {2(V-L)}{1-\left\vert 2L-1\right\vert }}={\frac {V-L}{\min(L,1-L)}},&{\text{otherwise}}\end{cases}}$$

## Swatches

Mouse over the [swatches](https://en.wikipedia.org/wiki/Palette_(computing)) below to see the $R$, $G$, and $B$ values for each swatch in a [tooltip](https://en.wikipedia.org/wiki/Tooltip).

### HSL

<table>
<tr>
<th></th>
<th colspan="4">H = 180°</th>
<th></th>
<th colspan="4">H = 0°</th>
</tr>
<tr>
<th>L\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#BFFFFF" title="R = 0.750, G = 1.000, B = 1.000 (#BFFFFF)"></td>
<td style="background:#C7F7F7" title="R = 0.781, G = 0.969, B = 0.969 (#C7F7F7)"></td>
<td style="background:#CFEFEF" title="R = 0.812, G = 0.938, B = 0.938 (#CFEFEF)"></td>
<td style="background:#D7E7E7" title="R = 0.844, G = 0.906, B = 0.906 (#D7E7E7)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#E7D7D7" title="R = 0.906, G = 0.844, B = 0.844 (#E7D7D7)"></td>
<td style="background:#EFCFCF" title="R = 0.938, G = 0.812, B = 0.812 (#EFCFCF)"></td>
<td style="background:#F7C7C7" title="R = 0.969, G = 0.781, B = 0.781 (#F7C7C7)"></td>
<td style="background:#FFBFBF" title="R = 1.000, G = 0.750, B = 0.750 (#FFBFBF)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#80FFFF" title="R = 0.500, G = 1.000, B = 1.000 (#80FFFF)"></td>
<td style="background:#8FEFEF" title="R = 0.562, G = 0.938, B = 0.938 (#8FEFEF)"></td>
<td style="background:#9FDFDF" title="R = 0.625, G = 0.875, B = 0.875 (#9FDFDF)"></td>
<td style="background:#AFCFCF" title="R = 0.688, G = 0.812, B = 0.812 (#AFCFCF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#CFAFAF" title="R = 0.812, G = 0.688, B = 0.688 (#CFAFAF)"></td>
<td style="background:#DF9F9F" title="R = 0.875, G = 0.625, B = 0.625 (#DF9F9F)"></td>
<td style="background:#EF8F8F" title="R = 0.938, G = 0.562, B = 0.562 (#EF8F8F)"></td>
<td style="background:#FF8080" title="R = 1.000, G = 0.500, B = 0.500 (#FF8080)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#40FFFF" title="R = 0.250, G = 1.000, B = 1.000 (#40FFFF)"></td>
<td style="background:#58E7E7" title="R = 0.344, G = 0.906, B = 0.906 (#58E7E7)"></td>
<td style="background:#70CFCF" title="R = 0.438, G = 0.812, B = 0.812 (#70CFCF)"></td>
<td style="background:#87B7B7" title="R = 0.531, G = 0.719, B = 0.719 (#87B7B7)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#B78787" title="R = 0.719, G = 0.531, B = 0.531 (#B78787)"></td>
<td style="background:#CF7070" title="R = 0.812, G = 0.438, B = 0.438 (#CF7070)"></td>
<td style="background:#E75858" title="R = 0.906, G = 0.344, B = 0.344 (#E75858)"></td>
<td style="background:#FF4040" title="R = 1.000, G = 0.250, B = 0.250 (#FF4040)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#00FFFF" title="R = 0.000, G = 1.000, B = 1.000 (#00FFFF)"></td>
<td style="background:#20DFDF" title="R = 0.125, G = 0.875, B = 0.875 (#20DFDF)"></td>
<td style="background:#40BFBF" title="R = 0.250, G = 0.750, B = 0.750 (#40BFBF)"></td>
<td style="background:#609F9F" title="R = 0.375, G = 0.625, B = 0.625 (#609F9F)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#9F6060" title="R = 0.625, G = 0.375, B = 0.375 (#9F6060)"></td>
<td style="background:#BF4040" title="R = 0.750, G = 0.250, B = 0.250 (#BF4040)"></td>
<td style="background:#DF2020" title="R = 0.875, G = 0.125, B = 0.125 (#DF2020)"></td>
<td style="background:#FF0000" title="R = 1.000, G = 0.000, B = 0.000 (#FF0000)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#00BFBF" title="R = 0.000, G = 0.750, B = 0.750 (#00BFBF)"></td>
<td style="background:#18A7A7" title="R = 0.094, G = 0.656, B = 0.656 (#18A7A7)"></td>
<td style="background:#308F8F" title="R = 0.188, G = 0.562, B = 0.562 (#308F8F)"></td>
<td style="background:#487878" title="R = 0.281, G = 0.469, B = 0.469 (#487878)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#784848" title="R = 0.469, G = 0.281, B = 0.281 (#784848)"></td>
<td style="background:#8F3030" title="R = 0.562, G = 0.188, B = 0.188 (#8F3030)"></td>
<td style="background:#A71818" title="R = 0.656, G = 0.094, B = 0.094 (#A71818)"></td>
<td style="background:#BF0000" title="R = 0.750, G = 0.000, B = 0.000 (#BF0000)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#008080" title="R = 0.000, G = 0.500, B = 0.500 (#008080)"></td>
<td style="background:#107070" title="R = 0.062, G = 0.438, B = 0.438 (#107070)"></td>
<td style="background:#206060" title="R = 0.125, G = 0.375, B = 0.375 (#206060)"></td>
<td style="background:#305050" title="R = 0.188, G = 0.312, B = 0.312 (#305050)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#503030" title="R = 0.312, G = 0.188, B = 0.188 (#503030)"></td>
<td style="background:#602020" title="R = 0.375, G = 0.125, B = 0.125 (#602020)"></td>
<td style="background:#701010" title="R = 0.438, G = 0.062, B = 0.062 (#701010)"></td>
<td style="background:#800000" title="R = 0.500, G = 0.000, B = 0.000 (#800000)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#004040" title="R = 0.000, G = 0.250, B = 0.250 (#004040)"></td>
<td style="background:#083838" title="R = 0.031, G = 0.219, B = 0.219 (#083838)"></td>
<td style="background:#103030" title="R = 0.062, G = 0.188, B = 0.188 (#103030)"></td>
<td style="background:#182828" title="R = 0.094, G = 0.156, B = 0.156 (#182828)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#281818" title="R = 0.156, G = 0.094, B = 0.094 (#281818)"></td>
<td style="background:#301010" title="R = 0.188, G = 0.062, B = 0.062 (#301010)"></td>
<td style="background:#380808" title="R = 0.219, G = 0.031, B = 0.031 (#380808)"></td>
<td style="background:#400000" title="R = 0.250, G = 0.000, B = 0.000 (#400000)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

<table>
<tr>
<th></th>
<th colspan="4">H = 210°</th>
<th></th>
<th colspan="4">H = 30°</th>
</tr>
<tr>
<th>L\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#BFDFFF" title="R = 0.750, G = 0.875, B = 1.000 (#BFDFFF)"></td>
<td style="background:#C7DFF7" title="R = 0.781, G = 0.875, B = 0.969 (#C7DFF7)"></td>
<td style="background:#CFDFEF" title="R = 0.812, G = 0.875, B = 0.938 (#CFDFEF)"></td>
<td style="background:#D7DFE7" title="R = 0.844, G = 0.875, B = 0.906 (#D7DFE7)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#E7DFD7" title="R = 0.906, G = 0.875, B = 0.844 (#E7DFD7)"></td>
<td style="background:#EFDFCF" title="R = 0.938, G = 0.875, B = 0.812 (#EFDFCF)"></td>
<td style="background:#F7DFC7" title="R = 0.969, G = 0.875, B = 0.781 (#F7DFC7)"></td>
<td style="background:#FFDFBF" title="R = 1.000, G = 0.875, B = 0.750 (#FFDFBF)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#80BFFF" title="R = 0.500, G = 0.750, B = 1.000 (#80BFFF)"></td>
<td style="background:#8FBFEF" title="R = 0.562, G = 0.750, B = 0.938 (#8FBFEF)"></td>
<td style="background:#9FBFDF" title="R = 0.625, G = 0.750, B = 0.875 (#9FBFDF)"></td>
<td style="background:#AFBFCF" title="R = 0.688, G = 0.750, B = 0.812 (#AFBFCF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#CFBFAF" title="R = 0.812, G = 0.750, B = 0.688 (#CFBFAF)"></td>
<td style="background:#DFBF9F" title="R = 0.875, G = 0.750, B = 0.625 (#DFBF9F)"></td>
<td style="background:#EFBF8F" title="R = 0.938, G = 0.750, B = 0.562 (#EFBF8F)"></td>
<td style="background:#FFBF80" title="R = 1.000, G = 0.750, B = 0.500 (#FFBF80)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#409FFF" title="R = 0.250, G = 0.625, B = 1.000 (#409FFF)"></td>
<td style="background:#589FE7" title="R = 0.344, G = 0.625, B = 0.906 (#589FE7)"></td>
<td style="background:#709FCF" title="R = 0.438, G = 0.625, B = 0.812 (#709FCF)"></td>
<td style="background:#879FB7" title="R = 0.531, G = 0.625, B = 0.719 (#879FB7)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#B79F87" title="R = 0.719, G = 0.625, B = 0.531 (#B79F87)"></td>
<td style="background:#CF9F70" title="R = 0.812, G = 0.625, B = 0.438 (#CF9F70)"></td>
<td style="background:#E79F58" title="R = 0.906, G = 0.625, B = 0.344 (#E79F58)"></td>
<td style="background:#FF9F40" title="R = 1.000, G = 0.625, B = 0.250 (#FF9F40)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#0080FF" title="R = 0.000, G = 0.500, B = 1.000 (#0080FF)"></td>
<td style="background:#2080DF" title="R = 0.125, G = 0.500, B = 0.875 (#2080DF)"></td>
<td style="background:#4080BF" title="R = 0.250, G = 0.500, B = 0.750 (#4080BF)"></td>
<td style="background:#60809F" title="R = 0.375, G = 0.500, B = 0.625 (#60809F)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#9F8060" title="R = 0.625, G = 0.500, B = 0.375 (#9F8060)"></td>
<td style="background:#BF8040" title="R = 0.750, G = 0.500, B = 0.250 (#BF8040)"></td>
<td style="background:#DF8020" title="R = 0.875, G = 0.500, B = 0.125 (#DF8020)"></td>
<td style="background:#FF8000" title="R = 1.000, G = 0.500, B = 0.000 (#FF8000)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#0060BF" title="R = 0.000, G = 0.375, B = 0.750 (#0060BF)"></td>
<td style="background:#1860A7" title="R = 0.094, G = 0.375, B = 0.656 (#1860A7)"></td>
<td style="background:#30608F" title="R = 0.188, G = 0.375, B = 0.562 (#30608F)"></td>
<td style="background:#486078" title="R = 0.281, G = 0.375, B = 0.469 (#486078)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#786048" title="R = 0.469, G = 0.375, B = 0.281 (#786048)"></td>
<td style="background:#8F6030" title="R = 0.562, G = 0.375, B = 0.188 (#8F6030)"></td>
<td style="background:#A76018" title="R = 0.656, G = 0.375, B = 0.094 (#A76018)"></td>
<td style="background:#BF6000" title="R = 0.750, G = 0.375, B = 0.000 (#BF6000)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#004080" title="R = 0.000, G = 0.250, B = 0.500 (#004080)"></td>
<td style="background:#104070" title="R = 0.062, G = 0.250, B = 0.438 (#104070)"></td>
<td style="background:#204060" title="R = 0.125, G = 0.250, B = 0.375 (#204060)"></td>
<td style="background:#304050" title="R = 0.188, G = 0.250, B = 0.312 (#304050)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#504030" title="R = 0.312, G = 0.250, B = 0.188 (#504030)"></td>
<td style="background:#604020" title="R = 0.375, G = 0.250, B = 0.125 (#604020)"></td>
<td style="background:#704010" title="R = 0.438, G = 0.250, B = 0.062 (#704010)"></td>
<td style="background:#804000" title="R = 0.500, G = 0.250, B = 0.000 (#804000)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#002040" title="R = 0.000, G = 0.125, B = 0.250 (#002040)"></td>
<td style="background:#082038" title="R = 0.031, G = 0.125, B = 0.219 (#082038)"></td>
<td style="background:#102030" title="R = 0.062, G = 0.125, B = 0.188 (#102030)"></td>
<td style="background:#182028" title="R = 0.094, G = 0.125, B = 0.156 (#182028)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#282018" title="R = 0.156, G = 0.125, B = 0.094 (#282018)"></td>
<td style="background:#302010" title="R = 0.188, G = 0.125, B = 0.062 (#302010)"></td>
<td style="background:#382008" title="R = 0.219, G = 0.125, B = 0.031 (#382008)"></td>
<td style="background:#402000" title="R = 0.250, G = 0.125, B = 0.000 (#402000)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

<table>
<tr>
<th></th>
<th colspan="4">H = 240°</th>
<th></th>
<th colspan="4">H = 60°</th>
</tr>
<tr>
<th>L\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#BFBFFF" title="R = 0.750, G = 0.750, B = 1.000 (#BFBFFF)"></td>
<td style="background:#C7C7F7" title="R = 0.781, G = 0.781, B = 0.969 (#C7C7F7)"></td>
<td style="background:#CFCFEF" title="R = 0.812, G = 0.812, B = 0.938 (#CFCFEF)"></td>
<td style="background:#D7D7E7" title="R = 0.844, G = 0.844, B = 0.906 (#D7D7E7)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#E7E7D7" title="R = 0.906, G = 0.906, B = 0.844 (#E7E7D7)"></td>
<td style="background:#EFEFCF" title="R = 0.938, G = 0.938, B = 0.812 (#EFEFCF)"></td>
<td style="background:#F7F7C7" title="R = 0.969, G = 0.969, B = 0.781 (#F7F7C7)"></td>
<td style="background:#FFFFBF" title="R = 1.000, G = 1.000, B = 0.750 (#FFFFBF)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#8080FF" title="R = 0.500, G = 0.500, B = 1.000 (#8080FF)"></td>
<td style="background:#8F8FEF" title="R = 0.562, G = 0.562, B = 0.938 (#8F8FEF)"></td>
<td style="background:#9F9FDF" title="R = 0.625, G = 0.625, B = 0.875 (#9F9FDF)"></td>
<td style="background:#AFAFCF" title="R = 0.688, G = 0.688, B = 0.812 (#AFAFCF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#CFCFAF" title="R = 0.812, G = 0.812, B = 0.688 (#CFCFAF)"></td>
<td style="background:#DFDF9F" title="R = 0.875, G = 0.875, B = 0.625 (#DFDF9F)"></td>
<td style="background:#EFEF8F" title="R = 0.938, G = 0.938, B = 0.562 (#EFEF8F)"></td>
<td style="background:#FFFF80" title="R = 1.000, G = 1.000, B = 0.500 (#FFFF80)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#4040FF" title="R = 0.250, G = 0.250, B = 1.000 (#4040FF)"></td>
<td style="background:#5858E7" title="R = 0.344, G = 0.344, B = 0.906 (#5858E7)"></td>
<td style="background:#7070CF" title="R = 0.438, G = 0.438, B = 0.812 (#7070CF)"></td>
<td style="background:#8787B7" title="R = 0.531, G = 0.531, B = 0.719 (#8787B7)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#B7B787" title="R = 0.719, G = 0.719, B = 0.531 (#B7B787)"></td>
<td style="background:#CFCF70" title="R = 0.812, G = 0.812, B = 0.438 (#CFCF70)"></td>
<td style="background:#E7E758" title="R = 0.906, G = 0.906, B = 0.344 (#E7E758)"></td>
<td style="background:#FFFF40" title="R = 1.000, G = 1.000, B = 0.250 (#FFFF40)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#0000FF" title="R = 0.000, G = 0.000, B = 1.000 (#0000FF)"></td>
<td style="background:#2020DF" title="R = 0.125, G = 0.125, B = 0.875 (#2020DF)"></td>
<td style="background:#4040BF" title="R = 0.250, G = 0.250, B = 0.750 (#4040BF)"></td>
<td style="background:#60609F" title="R = 0.375, G = 0.375, B = 0.625 (#60609F)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#9F9F60" title="R = 0.625, G = 0.625, B = 0.375 (#9F9F60)"></td>
<td style="background:#BFBF40" title="R = 0.750, G = 0.750, B = 0.250 (#BFBF40)"></td>
<td style="background:#DFDF20" title="R = 0.875, G = 0.875, B = 0.125 (#DFDF20)"></td>
<td style="background:#FFFF00" title="R = 1.000, G = 1.000, B = 0.000 (#FFFF00)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#0000BF" title="R = 0.000, G = 0.000, B = 0.750 (#0000BF)"></td>
<td style="background:#1818A7" title="R = 0.094, G = 0.094, B = 0.656 (#1818A7)"></td>
<td style="background:#30308F" title="R = 0.188, G = 0.188, B = 0.562 (#30308F)"></td>
<td style="background:#484878" title="R = 0.281, G = 0.281, B = 0.469 (#484878)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#787848" title="R = 0.469, G = 0.469, B = 0.281 (#787848)"></td>
<td style="background:#8F8F30" title="R = 0.562, G = 0.562, B = 0.188 (#8F8F30)"></td>
<td style="background:#A7A718" title="R = 0.656, G = 0.656, B = 0.094 (#A7A718)"></td>
<td style="background:#BFBF00" title="R = 0.750, G = 0.750, B = 0.000 (#BFBF00)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#000080" title="R = 0.000, G = 0.000, B = 0.500 (#000080)"></td>
<td style="background:#101070" title="R = 0.062, G = 0.062, B = 0.438 (#101070)"></td>
<td style="background:#202060" title="R = 0.125, G = 0.125, B = 0.375 (#202060)"></td>
<td style="background:#303050" title="R = 0.188, G = 0.188, B = 0.312 (#303050)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#505030" title="R = 0.312, G = 0.312, B = 0.188 (#505030)"></td>
<td style="background:#606020" title="R = 0.375, G = 0.375, B = 0.125 (#606020)"></td>
<td style="background:#707010" title="R = 0.438, G = 0.438, B = 0.062 (#707010)"></td>
<td style="background:#808000" title="R = 0.500, G = 0.500, B = 0.000 (#808000)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#000040" title="R = 0.000, G = 0.000, B = 0.250 (#000040)"></td>
<td style="background:#080838" title="R = 0.031, G = 0.031, B = 0.219 (#080838)"></td>
<td style="background:#101030" title="R = 0.062, G = 0.062, B = 0.188 (#101030)"></td>
<td style="background:#181828" title="R = 0.094, G = 0.094, B = 0.156 (#181828)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#282818" title="R = 0.156, G = 0.156, B = 0.094 (#282818)"></td>
<td style="background:#303010" title="R = 0.188, G = 0.188, B = 0.062 (#303010)"></td>
<td style="background:#383808" title="R = 0.219, G = 0.219, B = 0.031 (#383808)"></td>
<td style="background:#404000" title="R = 0.250, G = 0.250, B = 0.000 (#404000)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

<table>
<tr>
<th></th>
<th colspan="4">H = 270°</th>
<th></th>
<th colspan="4">H = 90°</th>
</tr>
<tr>
<th>L\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#DFBFFF" title="R = 0.875, G = 0.750, B = 1.000 (#DFBFFF)"></td>
<td style="background:#DFC7F7" title="R = 0.875, G = 0.781, B = 0.969 (#DFC7F7)"></td>
<td style="background:#DFCFEF" title="R = 0.875, G = 0.812, B = 0.938 (#DFCFEF)"></td>
<td style="background:#DFD7E7" title="R = 0.875, G = 0.844, B = 0.906 (#DFD7E7)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#DFE7D7" title="R = 0.875, G = 0.906, B = 0.844 (#DFE7D7)"></td>
<td style="background:#DFEFCF" title="R = 0.875, G = 0.938, B = 0.812 (#DFEFCF)"></td>
<td style="background:#DFF7C7" title="R = 0.875, G = 0.969, B = 0.781 (#DFF7C7)"></td>
<td style="background:#DFFFBF" title="R = 0.875, G = 1.000, B = 0.750 (#DFFFBF)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#BF80FF" title="R = 0.750, G = 0.500, B = 1.000 (#BF80FF)"></td>
<td style="background:#BF8FEF" title="R = 0.750, G = 0.562, B = 0.938 (#BF8FEF)"></td>
<td style="background:#BF9FDF" title="R = 0.750, G = 0.625, B = 0.875 (#BF9FDF)"></td>
<td style="background:#BFAFCF" title="R = 0.750, G = 0.688, B = 0.812 (#BFAFCF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#BFCFAF" title="R = 0.750, G = 0.812, B = 0.688 (#BFCFAF)"></td>
<td style="background:#BFDF9F" title="R = 0.750, G = 0.875, B = 0.625 (#BFDF9F)"></td>
<td style="background:#BFEF8F" title="R = 0.750, G = 0.938, B = 0.562 (#BFEF8F)"></td>
<td style="background:#BFFF80" title="R = 0.750, G = 1.000, B = 0.500 (#BFFF80)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#9F40FF" title="R = 0.625, G = 0.250, B = 1.000 (#9F40FF)"></td>
<td style="background:#9F58E7" title="R = 0.625, G = 0.344, B = 0.906 (#9F58E7)"></td>
<td style="background:#9F70CF" title="R = 0.625, G = 0.438, B = 0.812 (#9F70CF)"></td>
<td style="background:#9F87B7" title="R = 0.625, G = 0.531, B = 0.719 (#9F87B7)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#9FB787" title="R = 0.625, G = 0.719, B = 0.531 (#9FB787)"></td>
<td style="background:#9FCF70" title="R = 0.625, G = 0.812, B = 0.438 (#9FCF70)"></td>
<td style="background:#9FE758" title="R = 0.625, G = 0.906, B = 0.344 (#9FE758)"></td>
<td style="background:#9FFF40" title="R = 0.625, G = 1.000, B = 0.250 (#9FFF40)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#8000FF" title="R = 0.500, G = 0.000, B = 1.000 (#8000FF)"></td>
<td style="background:#8020DF" title="R = 0.500, G = 0.125, B = 0.875 (#8020DF)"></td>
<td style="background:#8040BF" title="R = 0.500, G = 0.250, B = 0.750 (#8040BF)"></td>
<td style="background:#80609F" title="R = 0.500, G = 0.375, B = 0.625 (#80609F)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#809F60" title="R = 0.500, G = 0.625, B = 0.375 (#809F60)"></td>
<td style="background:#80BF40" title="R = 0.500, G = 0.750, B = 0.250 (#80BF40)"></td>
<td style="background:#80DF20" title="R = 0.500, G = 0.875, B = 0.125 (#80DF20)"></td>
<td style="background:#80FF00" title="R = 0.500, G = 1.000, B = 0.000 (#80FF00)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#6000BF" title="R = 0.375, G = 0.000, B = 0.750 (#6000BF)"></td>
<td style="background:#6018A7" title="R = 0.375, G = 0.094, B = 0.656 (#6018A7)"></td>
<td style="background:#60308F" title="R = 0.375, G = 0.188, B = 0.562 (#60308F)"></td>
<td style="background:#604878" title="R = 0.375, G = 0.281, B = 0.469 (#604878)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#607848" title="R = 0.375, G = 0.469, B = 0.281 (#607848)"></td>
<td style="background:#608F30" title="R = 0.375, G = 0.562, B = 0.188 (#608F30)"></td>
<td style="background:#60A718" title="R = 0.375, G = 0.656, B = 0.094 (#60A718)"></td>
<td style="background:#60BF00" title="R = 0.375, G = 0.750, B = 0.000 (#60BF00)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#400080" title="R = 0.250, G = 0.000, B = 0.500 (#400080)"></td>
<td style="background:#401070" title="R = 0.250, G = 0.062, B = 0.438 (#401070)"></td>
<td style="background:#402060" title="R = 0.250, G = 0.125, B = 0.375 (#402060)"></td>
<td style="background:#403050" title="R = 0.250, G = 0.188, B = 0.312 (#403050)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#405030" title="R = 0.250, G = 0.312, B = 0.188 (#405030)"></td>
<td style="background:#406020" title="R = 0.250, G = 0.375, B = 0.125 (#406020)"></td>
<td style="background:#407010" title="R = 0.250, G = 0.438, B = 0.062 (#407010)"></td>
<td style="background:#408000" title="R = 0.250, G = 0.500, B = 0.000 (#408000)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#200040" title="R = 0.125, G = 0.000, B = 0.250 (#200040)"></td>
<td style="background:#200838" title="R = 0.125, G = 0.031, B = 0.219 (#200838)"></td>
<td style="background:#201030" title="R = 0.125, G = 0.062, B = 0.188 (#201030)"></td>
<td style="background:#201828" title="R = 0.125, G = 0.094, B = 0.156 (#201828)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#202818" title="R = 0.125, G = 0.156, B = 0.094 (#202818)"></td>
<td style="background:#203010" title="R = 0.125, G = 0.188, B = 0.062 (#203010)"></td>
<td style="background:#203808" title="R = 0.125, G = 0.219, B = 0.031 (#203808)"></td>
<td style="background:#204000" title="R = 0.125, G = 0.250, B = 0.000 (#204000)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

<table>
<tr>
<th></th>
<th colspan="4">H = 300°</th>
<th></th>
<th colspan="4">H = 120°</th>
</tr>
<tr>
<th>L\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#FFBFFF" title="R = 1.000, G = 0.750, B = 1.000 (#FFBFFF)"></td>
<td style="background:#F7C7F7" title="R = 0.969, G = 0.781, B = 0.969 (#F7C7F7)"></td>
<td style="background:#EFCFEF" title="R = 0.938, G = 0.812, B = 0.938 (#EFCFEF)"></td>
<td style="background:#E7D7E7" title="R = 0.906, G = 0.844, B = 0.906 (#E7D7E7)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#D7E7D7" title="R = 0.844, G = 0.906, B = 0.844 (#D7E7D7)"></td>
<td style="background:#CFEFCF" title="R = 0.812, G = 0.938, B = 0.812 (#CFEFCF)"></td>
<td style="background:#C7F7C7" title="R = 0.781, G = 0.969, B = 0.781 (#C7F7C7)"></td>
<td style="background:#BFFFBF" title="R = 0.750, G = 1.000, B = 0.750 (#BFFFBF)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#FF80FF" title="R = 1.000, G = 0.500, B = 1.000 (#FF80FF)"></td>
<td style="background:#EF8FEF" title="R = 0.938, G = 0.562, B = 0.938 (#EF8FEF)"></td>
<td style="background:#DF9FDF" title="R = 0.875, G = 0.625, B = 0.875 (#DF9FDF)"></td>
<td style="background:#CFAFCF" title="R = 0.812, G = 0.688, B = 0.812 (#CFAFCF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#AFCFAF" title="R = 0.688, G = 0.812, B = 0.688 (#AFCFAF)"></td>
<td style="background:#9FDF9F" title="R = 0.625, G = 0.875, B = 0.625 (#9FDF9F)"></td>
<td style="background:#8FEF8F" title="R = 0.562, G = 0.938, B = 0.562 (#8FEF8F)"></td>
<td style="background:#80FF80" title="R = 0.500, G = 1.000, B = 0.500 (#80FF80)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#FF40FF" title="R = 1.000, G = 0.250, B = 1.000 (#FF40FF)"></td>
<td style="background:#E758E7" title="R = 0.906, G = 0.344, B = 0.906 (#E758E7)"></td>
<td style="background:#CF70CF" title="R = 0.812, G = 0.438, B = 0.812 (#CF70CF)"></td>
<td style="background:#B787B7" title="R = 0.719, G = 0.531, B = 0.719 (#B787B7)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#87B787" title="R = 0.531, G = 0.719, B = 0.531 (#87B787)"></td>
<td style="background:#70CF70" title="R = 0.438, G = 0.812, B = 0.438 (#70CF70)"></td>
<td style="background:#58E758" title="R = 0.344, G = 0.906, B = 0.344 (#58E758)"></td>
<td style="background:#40FF40" title="R = 0.250, G = 1.000, B = 0.250 (#40FF40)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#FF00FF" title="R = 1.000, G = 0.000, B = 1.000 (#FF00FF)"></td>
<td style="background:#DF20DF" title="R = 0.875, G = 0.125, B = 0.875 (#DF20DF)"></td>
<td style="background:#BF40BF" title="R = 0.750, G = 0.250, B = 0.750 (#BF40BF)"></td>
<td style="background:#9F609F" title="R = 0.625, G = 0.375, B = 0.625 (#9F609F)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#609F60" title="R = 0.375, G = 0.625, B = 0.375 (#609F60)"></td>
<td style="background:#40BF40" title="R = 0.250, G = 0.750, B = 0.250 (#40BF40)"></td>
<td style="background:#20DF20" title="R = 0.125, G = 0.875, B = 0.125 (#20DF20)"></td>
<td style="background:#00FF00" title="R = 0.000, G = 1.000, B = 0.000 (#00FF00)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#BF00BF" title="R = 0.750, G = 0.000, B = 0.750 (#BF00BF)"></td>
<td style="background:#A718A7" title="R = 0.656, G = 0.094, B = 0.656 (#A718A7)"></td>
<td style="background:#8F308F" title="R = 0.562, G = 0.188, B = 0.562 (#8F308F)"></td>
<td style="background:#784878" title="R = 0.469, G = 0.281, B = 0.469 (#784878)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#487848" title="R = 0.281, G = 0.469, B = 0.281 (#487848)"></td>
<td style="background:#308F30" title="R = 0.188, G = 0.562, B = 0.188 (#308F30)"></td>
<td style="background:#18A718" title="R = 0.094, G = 0.656, B = 0.094 (#18A718)"></td>
<td style="background:#00BF00" title="R = 0.000, G = 0.750, B = 0.000 (#00BF00)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#800080" title="R = 0.500, G = 0.000, B = 0.500 (#800080)"></td>
<td style="background:#701070" title="R = 0.438, G = 0.062, B = 0.438 (#701070)"></td>
<td style="background:#602060" title="R = 0.375, G = 0.125, B = 0.375 (#602060)"></td>
<td style="background:#503050" title="R = 0.312, G = 0.188, B = 0.312 (#503050)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#305030" title="R = 0.188, G = 0.312, B = 0.188 (#305030)"></td>
<td style="background:#206020" title="R = 0.125, G = 0.375, B = 0.125 (#206020)"></td>
<td style="background:#107010" title="R = 0.062, G = 0.438, B = 0.062 (#107010)"></td>
<td style="background:#008000" title="R = 0.000, G = 0.500, B = 0.000 (#008000)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#400040" title="R = 0.250, G = 0.000, B = 0.250 (#400040)"></td>
<td style="background:#380838" title="R = 0.219, G = 0.031, B = 0.219 (#380838)"></td>
<td style="background:#301030" title="R = 0.188, G = 0.062, B = 0.188 (#301030)"></td>
<td style="background:#281828" title="R = 0.156, G = 0.094, B = 0.156 (#281828)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#182818" title="R = 0.094, G = 0.156, B = 0.094 (#182818)"></td>
<td style="background:#103010" title="R = 0.062, G = 0.188, B = 0.062 (#103010)"></td>
<td style="background:#083808" title="R = 0.031, G = 0.219, B = 0.031 (#083808)"></td>
<td style="background:#004000" title="R = 0.000, G = 0.250, B = 0.000 (#004000)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

<table>
<tr>
<th></th>
<th colspan="4">H = 330°</th>
<th></th>
<th colspan="4">H = 150°</th>
</tr>
<tr>
<th>L\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#FFBFDF" title="R = 1.000, G = 0.750, B = 0.875 (#FFBFDF)"></td>
<td style="background:#F7C7DF" title="R = 0.969, G = 0.781, B = 0.875 (#F7C7DF)"></td>
<td style="background:#EFCFDF" title="R = 0.938, G = 0.812, B = 0.875 (#EFCFDF)"></td>
<td style="background:#E7D7DF" title="R = 0.906, G = 0.844, B = 0.875 (#E7D7DF)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#D7E7DF" title="R = 0.844, G = 0.906, B = 0.875 (#D7E7DF)"></td>
<td style="background:#CFEFDF" title="R = 0.812, G = 0.938, B = 0.875 (#CFEFDF)"></td>
<td style="background:#C7F7DF" title="R = 0.781, G = 0.969, B = 0.875 (#C7F7DF)"></td>
<td style="background:#BFFFDF" title="R = 0.750, G = 1.000, B = 0.875 (#BFFFDF)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#FF80BF" title="R = 1.000, G = 0.500, B = 0.750 (#FF80BF)"></td>
<td style="background:#EF8FBF" title="R = 0.938, G = 0.562, B = 0.750 (#EF8FBF)"></td>
<td style="background:#DF9FBF" title="R = 0.875, G = 0.625, B = 0.750 (#DF9FBF)"></td>
<td style="background:#CFAFBF" title="R = 0.812, G = 0.688, B = 0.750 (#CFAFBF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#AFCFBF" title="R = 0.688, G = 0.812, B = 0.750 (#AFCFBF)"></td>
<td style="background:#9FDFBF" title="R = 0.625, G = 0.875, B = 0.750 (#9FDFBF)"></td>
<td style="background:#8FEFBF" title="R = 0.562, G = 0.938, B = 0.750 (#8FEFBF)"></td>
<td style="background:#80FFBF" title="R = 0.500, G = 1.000, B = 0.750 (#80FFBF)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#FF409F" title="R = 1.000, G = 0.250, B = 0.625 (#FF409F)"></td>
<td style="background:#E7589F" title="R = 0.906, G = 0.344, B = 0.625 (#E7589F)"></td>
<td style="background:#CF709F" title="R = 0.812, G = 0.438, B = 0.625 (#CF709F)"></td>
<td style="background:#B7879F" title="R = 0.719, G = 0.531, B = 0.625 (#B7879F)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#87B79F" title="R = 0.531, G = 0.719, B = 0.625 (#87B79F)"></td>
<td style="background:#70CF9F" title="R = 0.438, G = 0.812, B = 0.625 (#70CF9F)"></td>
<td style="background:#58E79F" title="R = 0.344, G = 0.906, B = 0.625 (#58E79F)"></td>
<td style="background:#40FF9F" title="R = 0.250, G = 1.000, B = 0.625 (#40FF9F)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#FF0080" title="R = 1.000, G = 0.000, B = 0.500 (#FF0080)"></td>
<td style="background:#DF2080" title="R = 0.875, G = 0.125, B = 0.500 (#DF2080)"></td>
<td style="background:#BF4080" title="R = 0.750, G = 0.250, B = 0.500 (#BF4080)"></td>
<td style="background:#9F6080" title="R = 0.625, G = 0.375, B = 0.500 (#9F6080)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#609F80" title="R = 0.375, G = 0.625, B = 0.500 (#609F80)"></td>
<td style="background:#40BF80" title="R = 0.250, G = 0.750, B = 0.500 (#40BF80)"></td>
<td style="background:#20DF80" title="R = 0.125, G = 0.875, B = 0.500 (#20DF80)"></td>
<td style="background:#00FF80" title="R = 0.000, G = 1.000, B = 0.500 (#00FF80)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#BF0060" title="R = 0.750, G = 0.000, B = 0.375 (#BF0060)"></td>
<td style="background:#A71860" title="R = 0.656, G = 0.094, B = 0.375 (#A71860)"></td>
<td style="background:#8F3060" title="R = 0.562, G = 0.188, B = 0.375 (#8F3060)"></td>
<td style="background:#784860" title="R = 0.469, G = 0.281, B = 0.375 (#784860)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#487860" title="R = 0.281, G = 0.469, B = 0.375 (#487860)"></td>
<td style="background:#308F60" title="R = 0.188, G = 0.562, B = 0.375 (#308F60)"></td>
<td style="background:#18A760" title="R = 0.094, G = 0.656, B = 0.375 (#18A760)"></td>
<td style="background:#00BF60" title="R = 0.000, G = 0.750, B = 0.375 (#00BF60)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#800040" title="R = 0.500, G = 0.000, B = 0.250 (#800040)"></td>
<td style="background:#701040" title="R = 0.438, G = 0.062, B = 0.250 (#701040)"></td>
<td style="background:#602040" title="R = 0.375, G = 0.125, B = 0.250 (#602040)"></td>
<td style="background:#503040" title="R = 0.312, G = 0.188, B = 0.250 (#503040)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#305040" title="R = 0.188, G = 0.312, B = 0.250 (#305040)"></td>
<td style="background:#206040" title="R = 0.125, G = 0.375, B = 0.250 (#206040)"></td>
<td style="background:#107040" title="R = 0.062, G = 0.438, B = 0.250 (#107040)"></td>
<td style="background:#008040" title="R = 0.000, G = 0.500, B = 0.250 (#008040)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#400020" title="R = 0.250, G = 0.000, B = 0.125 (#400020)"></td>
<td style="background:#380820" title="R = 0.219, G = 0.031, B = 0.125 (#380820)"></td>
<td style="background:#301020" title="R = 0.188, G = 0.062, B = 0.125 (#301020)"></td>
<td style="background:#281820" title="R = 0.156, G = 0.094, B = 0.125 (#281820)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#182820" title="R = 0.094, G = 0.156, B = 0.125 (#182820)"></td>
<td style="background:#103020" title="R = 0.062, G = 0.188, B = 0.125 (#103020)"></td>
<td style="background:#083820" title="R = 0.031, G = 0.219, B = 0.125 (#083820)"></td>
<td style="background:#004020" title="R = 0.000, G = 0.250, B = 0.125 (#004020)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

### HSV

<table>
<tr>
<th></th>
<th colspan="4">H = 180°</th>
<th></th>
<th colspan="4">H = 0°</th>
</tr>
<tr>
<th>V\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#00FFFF" title="R = 0.000, G = 1.000, B = 1.000 (#00FFFF)"></td>
<td style="background:#40FFFF" title="R = 0.250, G = 1.000, B = 1.000 (#40FFFF)"></td>
<td style="background:#80FFFF" title="R = 0.500, G = 1.000, B = 1.000 (#80FFFF)"></td>
<td style="background:#BFFFFF" title="R = 0.750, G = 1.000, B = 1.000 (#BFFFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFBFBF" title="R = 1.000, G = 0.750, B = 0.750 (#FFBFBF)"></td>
<td style="background:#FF8080" title="R = 1.000, G = 0.500, B = 0.500 (#FF8080)"></td>
<td style="background:#FF4040" title="R = 1.000, G = 0.250, B = 0.250 (#FF4040)"></td>
<td style="background:#FF0000" title="R = 1.000, G = 0.000, B = 0.000 (#FF0000)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#00DFDF" title="R = 0.000, G = 0.875, B = 0.875 (#00DFDF)"></td>
<td style="background:#38DFDF" title="R = 0.219, G = 0.875, B = 0.875 (#38DFDF)"></td>
<td style="background:#70DFDF" title="R = 0.438, G = 0.875, B = 0.875 (#70DFDF)"></td>
<td style="background:#A7DFDF" title="R = 0.656, G = 0.875, B = 0.875 (#A7DFDF)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#DFA7A7" title="R = 0.875, G = 0.656, B = 0.656 (#DFA7A7)"></td>
<td style="background:#DF7070" title="R = 0.875, G = 0.438, B = 0.438 (#DF7070)"></td>
<td style="background:#DF3838" title="R = 0.875, G = 0.219, B = 0.219 (#DF3838)"></td>
<td style="background:#DF0000" title="R = 0.875, G = 0.000, B = 0.000 (#DF0000)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#00BFBF" title="R = 0.000, G = 0.750, B = 0.750 (#00BFBF)"></td>
<td style="background:#30BFBF" title="R = 0.188, G = 0.750, B = 0.750 (#30BFBF)"></td>
<td style="background:#60BFBF" title="R = 0.375, G = 0.750, B = 0.750 (#60BFBF)"></td>
<td style="background:#8FBFBF" title="R = 0.562, G = 0.750, B = 0.750 (#8FBFBF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#BF8F8F" title="R = 0.750, G = 0.562, B = 0.562 (#BF8F8F)"></td>
<td style="background:#BF6060" title="R = 0.750, G = 0.375, B = 0.375 (#BF6060)"></td>
<td style="background:#BF3030" title="R = 0.750, G = 0.188, B = 0.188 (#BF3030)"></td>
<td style="background:#BF0000" title="R = 0.750, G = 0.000, B = 0.000 (#BF0000)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#009F9F" title="R = 0.000, G = 0.625, B = 0.625 (#009F9F)"></td>
<td style="background:#289F9F" title="R = 0.156, G = 0.625, B = 0.625 (#289F9F)"></td>
<td style="background:#509F9F" title="R = 0.312, G = 0.625, B = 0.625 (#509F9F)"></td>
<td style="background:#789F9F" title="R = 0.469, G = 0.625, B = 0.625 (#789F9F)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#9F7878" title="R = 0.625, G = 0.469, B = 0.469 (#9F7878)"></td>
<td style="background:#9F5050" title="R = 0.625, G = 0.312, B = 0.312 (#9F5050)"></td>
<td style="background:#9F2828" title="R = 0.625, G = 0.156, B = 0.156 (#9F2828)"></td>
<td style="background:#9F0000" title="R = 0.625, G = 0.000, B = 0.000 (#9F0000)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#008080" title="R = 0.000, G = 0.500, B = 0.500 (#008080)"></td>
<td style="background:#208080" title="R = 0.125, G = 0.500, B = 0.500 (#208080)"></td>
<td style="background:#408080" title="R = 0.250, G = 0.500, B = 0.500 (#408080)"></td>
<td style="background:#608080" title="R = 0.375, G = 0.500, B = 0.500 (#608080)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#806060" title="R = 0.500, G = 0.375, B = 0.375 (#806060)"></td>
<td style="background:#804040" title="R = 0.500, G = 0.250, B = 0.250 (#804040)"></td>
<td style="background:#802020" title="R = 0.500, G = 0.125, B = 0.125 (#802020)"></td>
<td style="background:#800000" title="R = 0.500, G = 0.000, B = 0.000 (#800000)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#006060" title="R = 0.000, G = 0.375, B = 0.375 (#006060)"></td>
<td style="background:#186060" title="R = 0.094, G = 0.375, B = 0.375 (#186060)"></td>
<td style="background:#306060" title="R = 0.188, G = 0.375, B = 0.375 (#306060)"></td>
<td style="background:#486060" title="R = 0.281, G = 0.375, B = 0.375 (#486060)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#604848" title="R = 0.375, G = 0.281, B = 0.281 (#604848)"></td>
<td style="background:#603030" title="R = 0.375, G = 0.188, B = 0.188 (#603030)"></td>
<td style="background:#601818" title="R = 0.375, G = 0.094, B = 0.094 (#601818)"></td>
<td style="background:#600000" title="R = 0.375, G = 0.000, B = 0.000 (#600000)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#004040" title="R = 0.000, G = 0.250, B = 0.250 (#004040)"></td>
<td style="background:#104040" title="R = 0.062, G = 0.250, B = 0.250 (#104040)"></td>
<td style="background:#204040" title="R = 0.125, G = 0.250, B = 0.250 (#204040)"></td>
<td style="background:#304040" title="R = 0.188, G = 0.250, B = 0.250 (#304040)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#403030" title="R = 0.250, G = 0.188, B = 0.188 (#403030)"></td>
<td style="background:#402020" title="R = 0.250, G = 0.125, B = 0.125 (#402020)"></td>
<td style="background:#401010" title="R = 0.250, G = 0.062, B = 0.062 (#401010)"></td>
<td style="background:#400000" title="R = 0.250, G = 0.000, B = 0.000 (#400000)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#002020" title="R = 0.000, G = 0.125, B = 0.125 (#002020)"></td>
<td style="background:#082020" title="R = 0.031, G = 0.125, B = 0.125 (#082020)"></td>
<td style="background:#102020" title="R = 0.062, G = 0.125, B = 0.125 (#102020)"></td>
<td style="background:#182020" title="R = 0.094, G = 0.125, B = 0.125 (#182020)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#201818" title="R = 0.125, G = 0.094, B = 0.094 (#201818)"></td>
<td style="background:#201010" title="R = 0.125, G = 0.062, B = 0.062 (#201010)"></td>
<td style="background:#200808" title="R = 0.125, G = 0.031, B = 0.031 (#200808)"></td>
<td style="background:#200000" title="R = 0.125, G = 0.000, B = 0.000 (#200000)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

<table>
<tr>
<th></th>
<th colspan="4">H = 210°</th>
<th></th>
<th colspan="4">H = 30°</th>
</tr>
<tr>
<th>V\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#0080FF" title="R = 0.000, G = 0.500, B = 1.000 (#0080FF)"></td>
<td style="background:#409FFF" title="R = 0.250, G = 0.625, B = 1.000 (#409FFF)"></td>
<td style="background:#80BFFF" title="R = 0.500, G = 0.750, B = 1.000 (#80BFFF)"></td>
<td style="background:#BFDFFF" title="R = 0.750, G = 0.875, B = 1.000 (#BFDFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFDFBF" title="R = 1.000, G = 0.875, B = 0.750 (#FFDFBF)"></td>
<td style="background:#FFBF80" title="R = 1.000, G = 0.750, B = 0.500 (#FFBF80)"></td>
<td style="background:#FF9F40" title="R = 1.000, G = 0.625, B = 0.250 (#FF9F40)"></td>
<td style="background:#FF8000" title="R = 1.000, G = 0.500, B = 0.000 (#FF8000)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#0070DF" title="R = 0.000, G = 0.438, B = 0.875 (#0070DF)"></td>
<td style="background:#388BDF" title="R = 0.219, G = 0.547, B = 0.875 (#388BDF)"></td>
<td style="background:#70A7DF" title="R = 0.438, G = 0.656, B = 0.875 (#70A7DF)"></td>
<td style="background:#A7C3DF" title="R = 0.656, G = 0.766, B = 0.875 (#A7C3DF)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#DFC3A7" title="R = 0.875, G = 0.766, B = 0.656 (#DFC3A7)"></td>
<td style="background:#DFA770" title="R = 0.875, G = 0.656, B = 0.438 (#DFA770)"></td>
<td style="background:#DF8B38" title="R = 0.875, G = 0.547, B = 0.219 (#DF8B38)"></td>
<td style="background:#DF7000" title="R = 0.875, G = 0.438, B = 0.000 (#DF7000)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#0060BF" title="R = 0.000, G = 0.375, B = 0.750 (#0060BF)"></td>
<td style="background:#3078BF" title="R = 0.188, G = 0.469, B = 0.750 (#3078BF)"></td>
<td style="background:#608FBF" title="R = 0.375, G = 0.562, B = 0.750 (#608FBF)"></td>
<td style="background:#8FA7BF" title="R = 0.562, G = 0.656, B = 0.750 (#8FA7BF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#BFA78F" title="R = 0.750, G = 0.656, B = 0.562 (#BFA78F)"></td>
<td style="background:#BF8F60" title="R = 0.750, G = 0.562, B = 0.375 (#BF8F60)"></td>
<td style="background:#BF7830" title="R = 0.750, G = 0.469, B = 0.188 (#BF7830)"></td>
<td style="background:#BF6000" title="R = 0.750, G = 0.375, B = 0.000 (#BF6000)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#00509F" title="R = 0.000, G = 0.312, B = 0.625 (#00509F)"></td>
<td style="background:#28649F" title="R = 0.156, G = 0.391, B = 0.625 (#28649F)"></td>
<td style="background:#50789F" title="R = 0.312, G = 0.469, B = 0.625 (#50789F)"></td>
<td style="background:#788B9F" title="R = 0.469, G = 0.547, B = 0.625 (#788B9F)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#9F8B78" title="R = 0.625, G = 0.547, B = 0.469 (#9F8B78)"></td>
<td style="background:#9F7850" title="R = 0.625, G = 0.469, B = 0.312 (#9F7850)"></td>
<td style="background:#9F6428" title="R = 0.625, G = 0.391, B = 0.156 (#9F6428)"></td>
<td style="background:#9F5000" title="R = 0.625, G = 0.312, B = 0.000 (#9F5000)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#004080" title="R = 0.000, G = 0.250, B = 0.500 (#004080)"></td>
<td style="background:#205080" title="R = 0.125, G = 0.312, B = 0.500 (#205080)"></td>
<td style="background:#406080" title="R = 0.250, G = 0.375, B = 0.500 (#406080)"></td>
<td style="background:#607080" title="R = 0.375, G = 0.438, B = 0.500 (#607080)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#807060" title="R = 0.500, G = 0.438, B = 0.375 (#807060)"></td>
<td style="background:#806040" title="R = 0.500, G = 0.375, B = 0.250 (#806040)"></td>
<td style="background:#805020" title="R = 0.500, G = 0.312, B = 0.125 (#805020)"></td>
<td style="background:#804000" title="R = 0.500, G = 0.250, B = 0.000 (#804000)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#003060" title="R = 0.000, G = 0.188, B = 0.375 (#003060)"></td>
<td style="background:#183C60" title="R = 0.094, G = 0.234, B = 0.375 (#183C60)"></td>
<td style="background:#304860" title="R = 0.188, G = 0.281, B = 0.375 (#304860)"></td>
<td style="background:#485460" title="R = 0.281, G = 0.328, B = 0.375 (#485460)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#605448" title="R = 0.375, G = 0.328, B = 0.281 (#605448)"></td>
<td style="background:#604830" title="R = 0.375, G = 0.281, B = 0.188 (#604830)"></td>
<td style="background:#603C18" title="R = 0.375, G = 0.234, B = 0.094 (#603C18)"></td>
<td style="background:#603000" title="R = 0.375, G = 0.188, B = 0.000 (#603000)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#002040" title="R = 0.000, G = 0.125, B = 0.250 (#002040)"></td>
<td style="background:#102840" title="R = 0.062, G = 0.156, B = 0.250 (#102840)"></td>
<td style="background:#203040" title="R = 0.125, G = 0.188, B = 0.250 (#203040)"></td>
<td style="background:#303840" title="R = 0.188, G = 0.219, B = 0.250 (#303840)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#403830" title="R = 0.250, G = 0.219, B = 0.188 (#403830)"></td>
<td style="background:#403020" title="R = 0.250, G = 0.188, B = 0.125 (#403020)"></td>
<td style="background:#402810" title="R = 0.250, G = 0.156, B = 0.062 (#402810)"></td>
<td style="background:#402000" title="R = 0.250, G = 0.125, B = 0.000 (#402000)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#001020" title="R = 0.000, G = 0.062, B = 0.125 (#001020)"></td>
<td style="background:#081420" title="R = 0.031, G = 0.078, B = 0.125 (#081420)"></td>
<td style="background:#101820" title="R = 0.062, G = 0.094, B = 0.125 (#101820)"></td>
<td style="background:#181C20" title="R = 0.094, G = 0.109, B = 0.125 (#181C20)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#201C18" title="R = 0.125, G = 0.109, B = 0.094 (#201C18)"></td>
<td style="background:#201810" title="R = 0.125, G = 0.094, B = 0.062 (#201810)"></td>
<td style="background:#201408" title="R = 0.125, G = 0.078, B = 0.031 (#201408)"></td>
<td style="background:#201000" title="R = 0.125, G = 0.062, B = 0.000 (#201000)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

<table>
<tr>
<th></th>
<th colspan="4">H = 240°</th>
<th></th>
<th colspan="4">H = 60°</th>
</tr>
<tr>
<th>V\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#0000FF" title="R = 0.000, G = 0.000, B = 1.000 (#0000FF)"></td>
<td style="background:#4040FF" title="R = 0.250, G = 0.250, B = 1.000 (#4040FF)"></td>
<td style="background:#8080FF" title="R = 0.500, G = 0.500, B = 1.000 (#8080FF)"></td>
<td style="background:#BFBFFF" title="R = 0.750, G = 0.750, B = 1.000 (#BFBFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#FFFFBF" title="R = 1.000, G = 1.000, B = 0.750 (#FFFFBF)"></td>
<td style="background:#FFFF80" title="R = 1.000, G = 1.000, B = 0.500 (#FFFF80)"></td>
<td style="background:#FFFF40" title="R = 1.000, G = 1.000, B = 0.250 (#FFFF40)"></td>
<td style="background:#FFFF00" title="R = 1.000, G = 1.000, B = 0.000 (#FFFF00)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#0000DF" title="R = 0.000, G = 0.000, B = 0.875 (#0000DF)"></td>
<td style="background:#3838DF" title="R = 0.219, G = 0.219, B = 0.875 (#3838DF)"></td>
<td style="background:#7070DF" title="R = 0.438, G = 0.438, B = 0.875 (#7070DF)"></td>
<td style="background:#A7A7DF" title="R = 0.656, G = 0.656, B = 0.875 (#A7A7DF)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#DFDFA7" title="R = 0.875, G = 0.875, B = 0.656 (#DFDFA7)"></td>
<td style="background:#DFDF70" title="R = 0.875, G = 0.875, B = 0.438 (#DFDF70)"></td>
<td style="background:#DFDF38" title="R = 0.875, G = 0.875, B = 0.219 (#DFDF38)"></td>
<td style="background:#DFDF00" title="R = 0.875, G = 0.875, B = 0.000 (#DFDF00)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#0000BF" title="R = 0.000, G = 0.000, B = 0.750 (#0000BF)"></td>
<td style="background:#3030BF" title="R = 0.188, G = 0.188, B = 0.750 (#3030BF)"></td>
<td style="background:#6060BF" title="R = 0.375, G = 0.375, B = 0.750 (#6060BF)"></td>
<td style="background:#8F8FBF" title="R = 0.562, G = 0.562, B = 0.750 (#8F8FBF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#BFBF8F" title="R = 0.750, G = 0.750, B = 0.562 (#BFBF8F)"></td>
<td style="background:#BFBF60" title="R = 0.750, G = 0.750, B = 0.375 (#BFBF60)"></td>
<td style="background:#BFBF30" title="R = 0.750, G = 0.750, B = 0.188 (#BFBF30)"></td>
<td style="background:#BFBF00" title="R = 0.750, G = 0.750, B = 0.000 (#BFBF00)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#00009F" title="R = 0.000, G = 0.000, B = 0.625 (#00009F)"></td>
<td style="background:#28289F" title="R = 0.156, G = 0.156, B = 0.625 (#28289F)"></td>
<td style="background:#50509F" title="R = 0.312, G = 0.312, B = 0.625 (#50509F)"></td>
<td style="background:#78789F" title="R = 0.469, G = 0.469, B = 0.625 (#78789F)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#9F9F78" title="R = 0.625, G = 0.625, B = 0.469 (#9F9F78)"></td>
<td style="background:#9F9F50" title="R = 0.625, G = 0.625, B = 0.312 (#9F9F50)"></td>
<td style="background:#9F9F28" title="R = 0.625, G = 0.625, B = 0.156 (#9F9F28)"></td>
<td style="background:#9F9F00" title="R = 0.625, G = 0.625, B = 0.000 (#9F9F00)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#000080" title="R = 0.000, G = 0.000, B = 0.500 (#000080)"></td>
<td style="background:#202080" title="R = 0.125, G = 0.125, B = 0.500 (#202080)"></td>
<td style="background:#404080" title="R = 0.250, G = 0.250, B = 0.500 (#404080)"></td>
<td style="background:#606080" title="R = 0.375, G = 0.375, B = 0.500 (#606080)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#808060" title="R = 0.500, G = 0.500, B = 0.375 (#808060)"></td>
<td style="background:#808040" title="R = 0.500, G = 0.500, B = 0.250 (#808040)"></td>
<td style="background:#808020" title="R = 0.500, G = 0.500, B = 0.125 (#808020)"></td>
<td style="background:#808000" title="R = 0.500, G = 0.500, B = 0.000 (#808000)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#000060" title="R = 0.000, G = 0.000, B = 0.375 (#000060)"></td>
<td style="background:#181860" title="R = 0.094, G = 0.094, B = 0.375 (#181860)"></td>
<td style="background:#303060" title="R = 0.188, G = 0.188, B = 0.375 (#303060)"></td>
<td style="background:#484860" title="R = 0.281, G = 0.281, B = 0.375 (#484860)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#606048" title="R = 0.375, G = 0.375, B = 0.281 (#606048)"></td>
<td style="background:#606030" title="R = 0.375, G = 0.375, B = 0.188 (#606030)"></td>
<td style="background:#606018" title="R = 0.375, G = 0.375, B = 0.094 (#606018)"></td>
<td style="background:#606000" title="R = 0.375, G = 0.375, B = 0.000 (#606000)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#000040" title="R = 0.000, G = 0.000, B = 0.250 (#000040)"></td>
<td style="background:#101040" title="R = 0.062, G = 0.062, B = 0.250 (#101040)"></td>
<td style="background:#202040" title="R = 0.125, G = 0.125, B = 0.250 (#202040)"></td>
<td style="background:#303040" title="R = 0.188, G = 0.188, B = 0.250 (#303040)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#404030" title="R = 0.250, G = 0.250, B = 0.188 (#404030)"></td>
<td style="background:#404020" title="R = 0.250, G = 0.250, B = 0.125 (#404020)"></td>
<td style="background:#404010" title="R = 0.250, G = 0.250, B = 0.062 (#404010)"></td>
<td style="background:#404000" title="R = 0.250, G = 0.250, B = 0.000 (#404000)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#000020" title="R = 0.000, G = 0.000, B = 0.125 (#000020)"></td>
<td style="background:#080820" title="R = 0.031, G = 0.031, B = 0.125 (#080820)"></td>
<td style="background:#101020" title="R = 0.062, G = 0.062, B = 0.125 (#101020)"></td>
<td style="background:#181820" title="R = 0.094, G = 0.094, B = 0.125 (#181820)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#202018" title="R = 0.125, G = 0.125, B = 0.094 (#202018)"></td>
<td style="background:#202010" title="R = 0.125, G = 0.125, B = 0.062 (#202010)"></td>
<td style="background:#202008" title="R = 0.125, G = 0.125, B = 0.031 (#202008)"></td>
<td style="background:#202000" title="R = 0.125, G = 0.125, B = 0.000 (#202000)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

<table>
<tr>
<th></th>
<th colspan="4">H = 270°</th>
<th></th>
<th colspan="4">H = 90°</th>
</tr>
<tr>
<th>V\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#8000FF" title="R = 0.500, G = 0.000, B = 1.000 (#8000FF)"></td>
<td style="background:#9F40FF" title="R = 0.625, G = 0.250, B = 1.000 (#9F40FF)"></td>
<td style="background:#BF80FF" title="R = 0.750, G = 0.500, B = 1.000 (#BF80FF)"></td>
<td style="background:#DFBFFF" title="R = 0.875, G = 0.750, B = 1.000 (#DFBFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#DFFFBF" title="R = 0.875, G = 1.000, B = 0.750 (#DFFFBF)"></td>
<td style="background:#BFFF80" title="R = 0.750, G = 1.000, B = 0.500 (#BFFF80)"></td>
<td style="background:#9FFF40" title="R = 0.625, G = 1.000, B = 0.250 (#9FFF40)"></td>
<td style="background:#80FF00" title="R = 0.500, G = 1.000, B = 0.000 (#80FF00)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#7000DF" title="R = 0.438, G = 0.000, B = 0.875 (#7000DF)"></td>
<td style="background:#8B38DF" title="R = 0.547, G = 0.219, B = 0.875 (#8B38DF)"></td>
<td style="background:#A770DF" title="R = 0.656, G = 0.438, B = 0.875 (#A770DF)"></td>
<td style="background:#C3A7DF" title="R = 0.766, G = 0.656, B = 0.875 (#C3A7DF)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#C3DFA7" title="R = 0.766, G = 0.875, B = 0.656 (#C3DFA7)"></td>
<td style="background:#A7DF70" title="R = 0.656, G = 0.875, B = 0.438 (#A7DF70)"></td>
<td style="background:#8BDF38" title="R = 0.547, G = 0.875, B = 0.219 (#8BDF38)"></td>
<td style="background:#70DF00" title="R = 0.438, G = 0.875, B = 0.000 (#70DF00)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#6000BF" title="R = 0.375, G = 0.000, B = 0.750 (#6000BF)"></td>
<td style="background:#7830BF" title="R = 0.469, G = 0.188, B = 0.750 (#7830BF)"></td>
<td style="background:#8F60BF" title="R = 0.562, G = 0.375, B = 0.750 (#8F60BF)"></td>
<td style="background:#A78FBF" title="R = 0.656, G = 0.562, B = 0.750 (#A78FBF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#A7BF8F" title="R = 0.656, G = 0.750, B = 0.562 (#A7BF8F)"></td>
<td style="background:#8FBF60" title="R = 0.562, G = 0.750, B = 0.375 (#8FBF60)"></td>
<td style="background:#78BF30" title="R = 0.469, G = 0.750, B = 0.188 (#78BF30)"></td>
<td style="background:#60BF00" title="R = 0.375, G = 0.750, B = 0.000 (#60BF00)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#50009F" title="R = 0.312, G = 0.000, B = 0.625 (#50009F)"></td>
<td style="background:#64289F" title="R = 0.391, G = 0.156, B = 0.625 (#64289F)"></td>
<td style="background:#78509F" title="R = 0.469, G = 0.312, B = 0.625 (#78509F)"></td>
<td style="background:#8B789F" title="R = 0.547, G = 0.469, B = 0.625 (#8B789F)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#8B9F78" title="R = 0.547, G = 0.625, B = 0.469 (#8B9F78)"></td>
<td style="background:#789F50" title="R = 0.469, G = 0.625, B = 0.312 (#789F50)"></td>
<td style="background:#649F28" title="R = 0.391, G = 0.625, B = 0.156 (#649F28)"></td>
<td style="background:#509F00" title="R = 0.312, G = 0.625, B = 0.000 (#509F00)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#400080" title="R = 0.250, G = 0.000, B = 0.500 (#400080)"></td>
<td style="background:#502080" title="R = 0.312, G = 0.125, B = 0.500 (#502080)"></td>
<td style="background:#604080" title="R = 0.375, G = 0.250, B = 0.500 (#604080)"></td>
<td style="background:#706080" title="R = 0.438, G = 0.375, B = 0.500 (#706080)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#708060" title="R = 0.438, G = 0.500, B = 0.375 (#708060)"></td>
<td style="background:#608040" title="R = 0.375, G = 0.500, B = 0.250 (#608040)"></td>
<td style="background:#508020" title="R = 0.312, G = 0.500, B = 0.125 (#508020)"></td>
<td style="background:#408000" title="R = 0.250, G = 0.500, B = 0.000 (#408000)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#300060" title="R = 0.188, G = 0.000, B = 0.375 (#300060)"></td>
<td style="background:#3C1860" title="R = 0.234, G = 0.094, B = 0.375 (#3C1860)"></td>
<td style="background:#483060" title="R = 0.281, G = 0.188, B = 0.375 (#483060)"></td>
<td style="background:#544860" title="R = 0.328, G = 0.281, B = 0.375 (#544860)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#546048" title="R = 0.328, G = 0.375, B = 0.281 (#546048)"></td>
<td style="background:#486030" title="R = 0.281, G = 0.375, B = 0.188 (#486030)"></td>
<td style="background:#3C6018" title="R = 0.234, G = 0.375, B = 0.094 (#3C6018)"></td>
<td style="background:#306000" title="R = 0.188, G = 0.375, B = 0.000 (#306000)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#200040" title="R = 0.125, G = 0.000, B = 0.250 (#200040)"></td>
<td style="background:#281040" title="R = 0.156, G = 0.062, B = 0.250 (#281040)"></td>
<td style="background:#302040" title="R = 0.188, G = 0.125, B = 0.250 (#302040)"></td>
<td style="background:#383040" title="R = 0.219, G = 0.188, B = 0.250 (#383040)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#384030" title="R = 0.219, G = 0.250, B = 0.188 (#384030)"></td>
<td style="background:#304020" title="R = 0.188, G = 0.250, B = 0.125 (#304020)"></td>
<td style="background:#284010" title="R = 0.156, G = 0.250, B = 0.062 (#284010)"></td>
<td style="background:#204000" title="R = 0.125, G = 0.250, B = 0.000 (#204000)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#100020" title="R = 0.062, G = 0.000, B = 0.125 (#100020)"></td>
<td style="background:#140820" title="R = 0.078, G = 0.031, B = 0.125 (#140820)"></td>
<td style="background:#181020" title="R = 0.094, G = 0.062, B = 0.125 (#181020)"></td>
<td style="background:#1C1820" title="R = 0.109, G = 0.094, B = 0.125 (#1C1820)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#1C2018" title="R = 0.109, G = 0.125, B = 0.094 (#1C2018)"></td>
<td style="background:#182010" title="R = 0.094, G = 0.125, B = 0.062 (#182010)"></td>
<td style="background:#142008" title="R = 0.078, G = 0.125, B = 0.031 (#142008)"></td>
<td style="background:#102000" title="R = 0.062, G = 0.125, B = 0.000 (#102000)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

<table>
<tr>
<th></th>
<th colspan="4">H = 300°</th>
<th></th>
<th colspan="4">H = 120°</th>
</tr>
<tr>
<th>V\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#FF00FF" title="R = 1.000, G = 0.000, B = 1.000 (#FF00FF)"></td>
<td style="background:#FF40FF" title="R = 1.000, G = 0.250, B = 1.000 (#FF40FF)"></td>
<td style="background:#FF80FF" title="R = 1.000, G = 0.500, B = 1.000 (#FF80FF)"></td>
<td style="background:#FFBFFF" title="R = 1.000, G = 0.750, B = 1.000 (#FFBFFF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#BFFFBF" title="R = 0.750, G = 1.000, B = 0.750 (#BFFFBF)"></td>
<td style="background:#80FF80" title="R = 0.500, G = 1.000, B = 0.500 (#80FF80)"></td>
<td style="background:#40FF40" title="R = 0.250, G = 1.000, B = 0.250 (#40FF40)"></td>
<td style="background:#00FF00" title="R = 0.000, G = 1.000, B = 0.000 (#00FF00)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#DF00DF" title="R = 0.875, G = 0.000, B = 0.875 (#DF00DF)"></td>
<td style="background:#DF38DF" title="R = 0.875, G = 0.219, B = 0.875 (#DF38DF)"></td>
<td style="background:#DF70DF" title="R = 0.875, G = 0.438, B = 0.875 (#DF70DF)"></td>
<td style="background:#DFA7DF" title="R = 0.875, G = 0.656, B = 0.875 (#DFA7DF)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#A7DFA7" title="R = 0.656, G = 0.875, B = 0.656 (#A7DFA7)"></td>
<td style="background:#70DF70" title="R = 0.438, G = 0.875, B = 0.438 (#70DF70)"></td>
<td style="background:#38DF38" title="R = 0.219, G = 0.875, B = 0.219 (#38DF38)"></td>
<td style="background:#00DF00" title="R = 0.000, G = 0.875, B = 0.000 (#00DF00)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#BF00BF" title="R = 0.750, G = 0.000, B = 0.750 (#BF00BF)"></td>
<td style="background:#BF30BF" title="R = 0.750, G = 0.188, B = 0.750 (#BF30BF)"></td>
<td style="background:#BF60BF" title="R = 0.750, G = 0.375, B = 0.750 (#BF60BF)"></td>
<td style="background:#BF8FBF" title="R = 0.750, G = 0.562, B = 0.750 (#BF8FBF)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#8FBF8F" title="R = 0.562, G = 0.750, B = 0.562 (#8FBF8F)"></td>
<td style="background:#60BF60" title="R = 0.375, G = 0.750, B = 0.375 (#60BF60)"></td>
<td style="background:#30BF30" title="R = 0.188, G = 0.750, B = 0.188 (#30BF30)"></td>
<td style="background:#00BF00" title="R = 0.000, G = 0.750, B = 0.000 (#00BF00)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#9F009F" title="R = 0.625, G = 0.000, B = 0.625 (#9F009F)"></td>
<td style="background:#9F289F" title="R = 0.625, G = 0.156, B = 0.625 (#9F289F)"></td>
<td style="background:#9F509F" title="R = 0.625, G = 0.312, B = 0.625 (#9F509F)"></td>
<td style="background:#9F789F" title="R = 0.625, G = 0.469, B = 0.625 (#9F789F)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#789F78" title="R = 0.469, G = 0.625, B = 0.469 (#789F78)"></td>
<td style="background:#509F50" title="R = 0.312, G = 0.625, B = 0.312 (#509F50)"></td>
<td style="background:#289F28" title="R = 0.156, G = 0.625, B = 0.156 (#289F28)"></td>
<td style="background:#009F00" title="R = 0.000, G = 0.625, B = 0.000 (#009F00)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#800080" title="R = 0.500, G = 0.000, B = 0.500 (#800080)"></td>
<td style="background:#802080" title="R = 0.500, G = 0.125, B = 0.500 (#802080)"></td>
<td style="background:#804080" title="R = 0.500, G = 0.250, B = 0.500 (#804080)"></td>
<td style="background:#806080" title="R = 0.500, G = 0.375, B = 0.500 (#806080)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#608060" title="R = 0.375, G = 0.500, B = 0.375 (#608060)"></td>
<td style="background:#408040" title="R = 0.250, G = 0.500, B = 0.250 (#408040)"></td>
<td style="background:#208020" title="R = 0.125, G = 0.500, B = 0.125 (#208020)"></td>
<td style="background:#008000" title="R = 0.000, G = 0.500, B = 0.000 (#008000)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#600060" title="R = 0.375, G = 0.000, B = 0.375 (#600060)"></td>
<td style="background:#601860" title="R = 0.375, G = 0.094, B = 0.375 (#601860)"></td>
<td style="background:#603060" title="R = 0.375, G = 0.188, B = 0.375 (#603060)"></td>
<td style="background:#604860" title="R = 0.375, G = 0.281, B = 0.375 (#604860)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#486048" title="R = 0.281, G = 0.375, B = 0.281 (#486048)"></td>
<td style="background:#306030" title="R = 0.188, G = 0.375, B = 0.188 (#306030)"></td>
<td style="background:#186018" title="R = 0.094, G = 0.375, B = 0.094 (#186018)"></td>
<td style="background:#006000" title="R = 0.000, G = 0.375, B = 0.000 (#006000)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#400040" title="R = 0.250, G = 0.000, B = 0.250 (#400040)"></td>
<td style="background:#401040" title="R = 0.250, G = 0.062, B = 0.250 (#401040)"></td>
<td style="background:#402040" title="R = 0.250, G = 0.125, B = 0.250 (#402040)"></td>
<td style="background:#403040" title="R = 0.250, G = 0.188, B = 0.250 (#403040)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#304030" title="R = 0.188, G = 0.250, B = 0.188 (#304030)"></td>
<td style="background:#204020" title="R = 0.125, G = 0.250, B = 0.125 (#204020)"></td>
<td style="background:#104010" title="R = 0.062, G = 0.250, B = 0.062 (#104010)"></td>
<td style="background:#004000" title="R = 0.000, G = 0.250, B = 0.000 (#004000)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#200020" title="R = 0.125, G = 0.000, B = 0.125 (#200020)"></td>
<td style="background:#200820" title="R = 0.125, G = 0.031, B = 0.125 (#200820)"></td>
<td style="background:#201020" title="R = 0.125, G = 0.062, B = 0.125 (#201020)"></td>
<td style="background:#201820" title="R = 0.125, G = 0.094, B = 0.125 (#201820)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#182018" title="R = 0.094, G = 0.125, B = 0.094 (#182018)"></td>
<td style="background:#102010" title="R = 0.062, G = 0.125, B = 0.062 (#102010)"></td>
<td style="background:#082008" title="R = 0.031, G = 0.125, B = 0.031 (#082008)"></td>
<td style="background:#002000" title="R = 0.000, G = 0.125, B = 0.000 (#002000)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

<table>
<tr>
<th></th>
<th colspan="4">H = 330°</th>
<th></th>
<th colspan="4">H = 150°</th>
</tr>
<tr>
<th>V\S</th>
<th>1</th>
<th>3⁄4</th>
<th>1⁄2</th>
<th>1⁄4</th>
<th>0</th>
<th>1⁄4</th>
<th>1⁄2</th>
<th>3⁄4</th>
<th>1</th>
</tr>
<tr>
<th>1</th>
<td style="background:#FF0080" title="R = 1.000, G = 0.000, B = 0.500 (#FF0080)"></td>
<td style="background:#FF409F" title="R = 1.000, G = 0.250, B = 0.625 (#FF409F)"></td>
<td style="background:#FF80BF" title="R = 1.000, G = 0.500, B = 0.750 (#FF80BF)"></td>
<td style="background:#FFBFDF" title="R = 1.000, G = 0.750, B = 0.875 (#FFBFDF)"></td>
<td style="background:#FFFFFF" title="R = 1.000, G = 1.000, B = 1.000 (#FFFFFF)"></td>
<td style="background:#BFFFDF" title="R = 0.750, G = 1.000, B = 0.875 (#BFFFDF)"></td>
<td style="background:#80FFBF" title="R = 0.500, G = 1.000, B = 0.750 (#80FFBF)"></td>
<td style="background:#40FF9F" title="R = 0.250, G = 1.000, B = 0.625 (#40FF9F)"></td>
<td style="background:#00FF80" title="R = 0.000, G = 1.000, B = 0.500 (#00FF80)"></td>
</tr>
<tr>
<th>7⁄8</th>
<td style="background:#DF0070" title="R = 0.875, G = 0.000, B = 0.438 (#DF0070)"></td>
<td style="background:#DF388B" title="R = 0.875, G = 0.219, B = 0.547 (#DF388B)"></td>
<td style="background:#DF70A7" title="R = 0.875, G = 0.438, B = 0.656 (#DF70A7)"></td>
<td style="background:#DFA7C3" title="R = 0.875, G = 0.656, B = 0.766 (#DFA7C3)"></td>
<td style="background:#DFDFDF" title="R = 0.875, G = 0.875, B = 0.875 (#DFDFDF)"></td>
<td style="background:#A7DFC3" title="R = 0.656, G = 0.875, B = 0.766 (#A7DFC3)"></td>
<td style="background:#70DFA7" title="R = 0.438, G = 0.875, B = 0.656 (#70DFA7)"></td>
<td style="background:#38DF8B" title="R = 0.219, G = 0.875, B = 0.547 (#38DF8B)"></td>
<td style="background:#00DF70" title="R = 0.000, G = 0.875, B = 0.438 (#00DF70)"></td>
</tr>
<tr>
<th>3⁄4</th>
<td style="background:#BF0060" title="R = 0.750, G = 0.000, B = 0.375 (#BF0060)"></td>
<td style="background:#BF3078" title="R = 0.750, G = 0.188, B = 0.469 (#BF3078)"></td>
<td style="background:#BF608F" title="R = 0.750, G = 0.375, B = 0.562 (#BF608F)"></td>
<td style="background:#BF8FA7" title="R = 0.750, G = 0.562, B = 0.656 (#BF8FA7)"></td>
<td style="background:#BFBFBF" title="R = 0.750, G = 0.750, B = 0.750 (#BFBFBF)"></td>
<td style="background:#8FBFA7" title="R = 0.562, G = 0.750, B = 0.656 (#8FBFA7)"></td>
<td style="background:#60BF8F" title="R = 0.375, G = 0.750, B = 0.562 (#60BF8F)"></td>
<td style="background:#30BF78" title="R = 0.188, G = 0.750, B = 0.469 (#30BF78)"></td>
<td style="background:#00BF60" title="R = 0.000, G = 0.750, B = 0.375 (#00BF60)"></td>
</tr>
<tr>
<th>5⁄8</th>
<td style="background:#9F0050" title="R = 0.625, G = 0.000, B = 0.312 (#9F0050)"></td>
<td style="background:#9F2864" title="R = 0.625, G = 0.156, B = 0.391 (#9F2864)"></td>
<td style="background:#9F5078" title="R = 0.625, G = 0.312, B = 0.469 (#9F5078)"></td>
<td style="background:#9F788B" title="R = 0.625, G = 0.469, B = 0.547 (#9F788B)"></td>
<td style="background:#9F9F9F" title="R = 0.625, G = 0.625, B = 0.625 (#9F9F9F)"></td>
<td style="background:#789F8B" title="R = 0.469, G = 0.625, B = 0.547 (#789F8B)"></td>
<td style="background:#509F78" title="R = 0.312, G = 0.625, B = 0.469 (#509F78)"></td>
<td style="background:#289F64" title="R = 0.156, G = 0.625, B = 0.391 (#289F64)"></td>
<td style="background:#009F50" title="R = 0.000, G = 0.625, B = 0.312 (#009F50)"></td>
</tr>
<tr>
<th>1⁄2</th>
<td style="background:#800040" title="R = 0.500, G = 0.000, B = 0.250 (#800040)"></td>
<td style="background:#802050" title="R = 0.500, G = 0.125, B = 0.312 (#802050)"></td>
<td style="background:#804060" title="R = 0.500, G = 0.250, B = 0.375 (#804060)"></td>
<td style="background:#806070" title="R = 0.500, G = 0.375, B = 0.438 (#806070)"></td>
<td style="background:#808080" title="R = 0.500, G = 0.500, B = 0.500 (#808080)"></td>
<td style="background:#608070" title="R = 0.375, G = 0.500, B = 0.438 (#608070)"></td>
<td style="background:#408060" title="R = 0.250, G = 0.500, B = 0.375 (#408060)"></td>
<td style="background:#208050" title="R = 0.125, G = 0.500, B = 0.312 (#208050)"></td>
<td style="background:#008040" title="R = 0.000, G = 0.500, B = 0.250 (#008040)"></td>
</tr>
<tr>
<th>3⁄8</th>
<td style="background:#600030" title="R = 0.375, G = 0.000, B = 0.188 (#600030)"></td>
<td style="background:#60183C" title="R = 0.375, G = 0.094, B = 0.234 (#60183C)"></td>
<td style="background:#603048" title="R = 0.375, G = 0.188, B = 0.281 (#603048)"></td>
<td style="background:#604854" title="R = 0.375, G = 0.281, B = 0.328 (#604854)"></td>
<td style="background:#606060" title="R = 0.375, G = 0.375, B = 0.375 (#606060)"></td>
<td style="background:#486054" title="R = 0.281, G = 0.375, B = 0.328 (#486054)"></td>
<td style="background:#306048" title="R = 0.188, G = 0.375, B = 0.281 (#306048)"></td>
<td style="background:#18603C" title="R = 0.094, G = 0.375, B = 0.234 (#18603C)"></td>
<td style="background:#006030" title="R = 0.000, G = 0.375, B = 0.188 (#006030)"></td>
</tr>
<tr>
<th>1⁄4</th>
<td style="background:#400020" title="R = 0.250, G = 0.000, B = 0.125 (#400020)"></td>
<td style="background:#401028" title="R = 0.250, G = 0.062, B = 0.156 (#401028)"></td>
<td style="background:#402030" title="R = 0.250, G = 0.125, B = 0.188 (#402030)"></td>
<td style="background:#403038" title="R = 0.250, G = 0.188, B = 0.219 (#403038)"></td>
<td style="background:#404040" title="R = 0.250, G = 0.250, B = 0.250 (#404040)"></td>
<td style="background:#304038" title="R = 0.188, G = 0.250, B = 0.219 (#304038)"></td>
<td style="background:#204030" title="R = 0.125, G = 0.250, B = 0.188 (#204030)"></td>
<td style="background:#104028" title="R = 0.062, G = 0.250, B = 0.156 (#104028)"></td>
<td style="background:#004020" title="R = 0.000, G = 0.250, B = 0.125 (#004020)"></td>
</tr>
<tr>
<th>1⁄8</th>
<td style="background:#200010" title="R = 0.125, G = 0.000, B = 0.062 (#200010)"></td>
<td style="background:#200814" title="R = 0.125, G = 0.031, B = 0.078 (#200814)"></td>
<td style="background:#201018" title="R = 0.125, G = 0.062, B = 0.094 (#201018)"></td>
<td style="background:#20181C" title="R = 0.125, G = 0.094, B = 0.109 (#20181C)"></td>
<td style="background:#202020" title="R = 0.125, G = 0.125, B = 0.125 (#202020)"></td>
<td style="background:#18201C" title="R = 0.094, G = 0.125, B = 0.109 (#18201C)"></td>
<td style="background:#102018" title="R = 0.062, G = 0.125, B = 0.094 (#102018)"></td>
<td style="background:#082014" title="R = 0.031, G = 0.125, B = 0.078 (#082014)"></td>
<td style="background:#002010" title="R = 0.000, G = 0.125, B = 0.062 (#002010)"></td>
</tr>
<tr>
<th>0</th>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
<td style="background:#000000" title="R = 0.000, G = 0.000, B = 0.000 (#000000)"></td>
</tr>
</table>

## See also

- [Munsell color system](https://en.wikipedia.org/wiki/Munsell_color_system)

- [TSL color space](https://en.wikipedia.org/wiki/TSL_color_space)

## Notes

- **[A]** In the Joblove and Greenberg (1978) paper first introducing HSL, they called HSL lightness "intensity", called HSL saturation "relative chroma", called HSV saturation "saturation" and called HSV value "value". They carefully and unambiguously described and compared three models: hue/chroma/intensity, hue/relative chroma/intensity, and hue/value/saturation. Unfortunately, later authors were less fastidious, and current usage of these terms is inconsistent and often misleading.

- **[B]** The name *hexcone* for hexagonal pyramid was coined in Smith (1978), and stuck.

- **[C]** For instance, a 1982 study by Berk, et al., found that users were better at describing colors in terms of HSL than RGB coordinates, after being taught both systems, but were much better still at describing them in terms of the natural-language CNS model (which uses names such as "very dark grayish yellow-green" or "medium strong bluish purple"). This shouldn't be taken as gospel however: a 1987 study by Schwarz, et al., found that users could match colors using RGB controls faster than with HSL controls; a 1999 study by Douglas and Kirkpatrick found that the visual feedback in the user interface mattered more than the particular color model in use, for user matching speed.

- **[D]** "Clearly, if color appearance is to be described in a systematic, mathematical way, definitions of the phenomena being described need to be precise and universally agreed upon."

- **[E]** In Levkowitz and Herman's formulation, $R$, $G$, and $B$ stand for the voltages on the guns of a CRT display, which might have different maxima, and so their cartesian [gamut](https://en.wikipedia.org/wiki/Gamut) could be a box of any unequal dimensions. Other definitions commonly use integer values in the range [0, 255], storing the value for each component in one [byte](https://en.wikipedia.org/wiki/Byte). We define the RGB gamut to be a [unit cube](https://en.wikipedia.org/wiki/Unit_cube) for convenience because it simplifies and clarifies the math. Also, in general, HSL and HSV are today computed directly from [gamma-corrected](https://en.wikipedia.org/wiki/Gamma_correction) $R'$, $G'$, and $B'$ – for instance in [sRGB](https://en.wikipedia.org/wiki/SRGB) space – but, when the models were developed, might have been transformations of a linear RGB space. Early authors don't address gamma correction at all, except [Alvy Ray Smith](https://en.wikipedia.org/wiki/Alvy_Ray_Smith) who clearly states that "We shall assume that an RGB monitor is a linear device", and thus designed HSV using linear RGB. We will drop the primes, and the labels $R$, $G$, and $B$ should be taken to stand for the three attributes of the origin RGB space, whether or not it is gamma corrected.

- **[F]** Using the *chroma* here not only agrees with the original Joblove and Greenberg (1978) paper, but is also in the proper spirit of the psychometric definition of the term. Some models call this attribute *saturation* – for instance [Adobe Photoshop](https://en.wikipedia.org/wiki/Adobe_Photoshop)'s "Saturation" blend mode – but such use is even more confusing than the use of the term in HSL or HSV, especially when two substantially different definitions are used side by side.

- **[G]** Most of the computer graphics papers and books discussing HSL or HSV have a formula or algorithm describing them formally. Our formulas which follow are some mix of those. See, for instance, Agoston (2005) or Foley (1995)

- **[H]** Hanbury and Serra (2002) put a great deal of effort into explaining why what we call *chroma* here can be written as max($R$, $G$, $B$) − min($R$, $G$, $B$), and showing that this value is a [seminorm](https://en.wikipedia.org/wiki/Seminorm). They reserve the name *chroma* for the [Euclidean norm](https://en.wikipedia.org/wiki/Euclidean_norm) in the chromaticity plane (our $C_{2}$), and call this hexagonal distance *saturation* instead, as part of their IHLS model

- **[I]** In the following, the multiplication of hue by 60° – that is, 360°/6 – can be seen as the hexagonal-geometry analogue of the conversion from [radians](https://en.wikipedia.org/wiki/Radian) to degrees, a multiplication by 360°/2*π*: the circumference of a [unit circle](https://en.wikipedia.org/wiki/Unit_circle) is 2*π*; the circumference of a unit hexagon is 6.

- **[J]** For a more specific discussion of the term *luma*, see Charles Poynton (2008). See also [RGB color space#Specifications](https://en.wikipedia.org/wiki/RGB_color_space#Specifications). Photoshop exclusively uses the NTSC coefficients for its "Luminosity" blend mode regardless of the RGB color space involved.

- **[K]** The first nine colors in this table were chosen by hand, and the last ten colors were chosen at random.

- **[L]** See Smith (1978). Many of these screenshots were taken from the [GUIdebook](http://www.guidebookgallery.org/), and the rest were gathered from image search results.

- **[M]** For instance, a tool in [Illustrator](https://en.wikipedia.org/wiki/Adobe_Illustrator) CS4, and Adobe's related web tool, [Kuler](https://en.wikipedia.org/wiki/Adobe_Kuler?action=edit&redlink=1), both allow users to define color schemes based on HSV relationships, but with a hue circle modified to better match the [RYB model](https://en.wikipedia.org/wiki/RYB_color_model) used traditionally by painters. The web tools [ColorJack](https://www.colorjack.com/sphere/), [Color Wizard](http://www.colorsontheweb.com/colorwizard.asp), and [ColorBlender](http://www.colorblender.com/) all pick color schemes with reference to HSL or HSV.

- **[N]** Try a web search for "*[framework name]* color picker" for examples for a given framework, or "[JavaScript](https://en.wikipedia.org/wiki/JavaScript) color picker" for general results.

- **[O]** ArcGIS calls its map-symbol gradients "color ramps". Current versions of ArcGIS can use CIELAB instead for defining them.

- **[P]** For instance, the first version of Photoshop had an HSL-based tool; see ["Photoshop hue/saturation"](https://www.guidebookgallery.org/apps/photoshop/huesaturation) in the GUIdebook for screenshots.

- **[Q]** Photoshop's documentation explains that, e.g., "Luminosity: Creates a result color with the hue and saturation of the base color and the luminance of the blend color."

- **[R]** The HSL-style mode (with a Rec. 601 Luminosity) are also standardized in [CSS](https://en.wikipedia.org/wiki/CSS) from a documentation contributed by Adobe and Canon. GIMP 2.10 has switched to [LCH(ab)](https://en.wikipedia.org/wiki/CIELAB_color_space#Cylindrical_model) from its older HSV geometry.

- **[S]** The Ohta et al. model has parameters $I_{1} = (R + G + B)/3$, $I_{2} = (R - B)/2$, $I_{3} = (2G - R - B)/4$. $I_{1}$ is the same as our $I$, and $I_{2}$ and $I_{3}$ are similar to our *β* and *α*, respectively, except that (a) where *α* points in the direction of $R$ in the "chromaticity plane", $I_{3}$ points in the direction of $G$, and (b) the parameters have a different linear scaling which avoids the √3 of our *β*.

- **[T]** Most of the disadvantages below are listed in Poynton (1997), though as mere statements, without examples.

- **[U]** Some points in this cylinder fall out of [gamut](https://en.wikipedia.org/wiki/Gamut).

## References

1. See [Absolute color space](https://en.wikipedia.org/wiki/Absolute_color_space).

2. Levkowitz and Herman (1993)

3. Wilhelm Ostwald (1916). *Die Farbenfibel*. Leipzig.

4. Wilhelm Ostwald (1918). *Die Harmonie der Farben*. Leipzig.

5. [US patent 4694286](http://www.google.com/patents/about?id=WA8xAAAAEBAJ), Bergstedt, Gar A., "Apparatus and method for modifying displayed color images", published 1987-09-15, assigned to Tektronix, Inc

6. Toby Berk; Arie Kaufman; Lee Brownston (August 1982). ["A human factors study of color notation systems for computer graphics"](https://doi.org/10.1145%2F358589.358606). *Communications of the ACM*. **25** (8): 547–550. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/358589.358606](https://doi.org/10.1145%2F358589.358606). [S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier)) [14838329](https://api.semanticscholar.org/CorpusID:14838329).

7. Michael W. Schwarz; William B. Cowan; John C. Beatty (April 1987). ["An experimental comparison of RGB, YIQ, LAB, HSV, and opponent color models"](https://doi.org/10.1145%2F31336.31338). *ACM Transactions on Graphics*. **6** (2): 123–158. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/31336.31338](https://doi.org/10.1145%2F31336.31338). [S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier)) [17287484](https://api.semanticscholar.org/CorpusID:17287484).

8. Sarah A. Douglas; Arthur E. Kirkpatrick (April 1999). ["Model and representation: the effect of visual feedback on human performance in a color picker interface"](https://doi.org/10.1145%2F318009.318011). *ACM Transactions on Graphics*. **18** (2): 96–127. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/318009.318011](https://doi.org/10.1145%2F318009.318011). [S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier)) [14678328](https://api.semanticscholar.org/CorpusID:14678328).

9. The original patent on this idea was by [Georges Valensi](https://en.wikipedia.org/wiki/Georges_Valensi) in 1938: [FR patent 841335](https://worldwide.espacenet.com/textdoc?DB=EPODOC&IDX=FR841335), Valensi, Georges, "Procédé de télévision en couleurs", published 1939-05-17, issued 1939-02-06 [US patent 2375966](https://worldwide.espacenet.com/textdoc?DB=EPODOC&IDX=US2375966), Valensi, Georges, "System of television in colors", published 1945-05-15

10. Smith (1978)

11. Joblove and Greenberg (1978)

12. [Maureen C. Stone](https://en.wikipedia.org/wiki/Maureen_C._Stone) (August 2001). ["A Survey of Color for Computer Graphics"](https://graphics.stanford.edu/courses/cs448b-02-spring/04cdrom.pdf). Course at SIGGRAPH 2001.

13. Ware Myers (July 1979). ["Interactive Computer Graphics: Flying High-Part I"](https://web.archive.org/web/20210418055033/https://api.semanticscholar.org/CorpusID:15344162). *Computer*. **12** (7): 8–17. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1109/MC.1979.1658808](https://doi.org/10.1109%2FMC.1979.1658808). [S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier)) [15344162](https://api.semanticscholar.org/CorpusID:15344162). Archived from [the original](https://api.semanticscholar.org/CorpusID:15344162) on 2021-04-18.

14. N. Magnetat-Thalmann; N. Chourot; D. Thalmann (March 1984). "Colour Gradation, Shading and Texture Using a Limited Terminal". *Computer Graphics Forum*. **3**: 83–90. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1111/j.1467-8659.1984.tb00092.x](https://doi.org/10.1111%2Fj.1467-8659.1984.tb00092.x). [S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier)) [29541525](https://api.semanticscholar.org/CorpusID:29541525).

15. Computer Graphics Staff (August 1979). "Status report of the graphic standards planning committee". *ACM SIGGRAPH Computer Graphics*. **13** (3): 1–10. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/988497.988498](https://doi.org/10.1145%2F988497.988498). [S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier)) [43687764](https://api.semanticscholar.org/CorpusID:43687764).

16. Fairchild (2005), [pp. 83–93](https://books.google.com/books?id=8_TxzK2B-5MC&pg=PT106)

17. Kuehni (2003)

18. [*Standard Terminology of Appearance E284*](https://www.astm.org/Standards/E284.htm). [ASTM](https://en.wikipedia.org/wiki/ASTM_International). 2009.

19. [*International Lighting Vocabulary*](https://web.archive.org/web/20100227034508/http://www.cie.co.at/publ/abst/17-4-89.html) (4th ed.). [CIE](https://en.wikipedia.org/wiki/International_Commission_on_Illumination) and [IEC](https://en.wikipedia.org/wiki/International_Electrotechnical_Commission). 1987. [ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier)) [978-3-900734-07-7](https://en.wikipedia.org/wiki/Special:BookSources/978-3-900734-07-7). Archived from [the original](http://www.cie.co.at/publ/abst/17-4-89.html) on 2010-02-27. Retrieved 2010-02-05.

20. Poynton (1997)

21. Sharma, G. (2003). *Digital Color Imaging Handbook*. Boca Raton, FL: CRC Press. [ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier)) [978-0-8493-0900-7](https://en.wikipedia.org/wiki/Special:BookSources/978-0-8493-0900-7).

22. Hanbury and Serra (2002)

23. Hanbury (2008)

24. Patrick Lambert; Thierry Carron (1999). "Symbolic fusion of luminance-hue-chroma features for region segmentation". *Pattern Recognition*. **32** (11): 1857. [Bibcode](https://en.wikipedia.org/wiki/Bibcode_(identifier)):[1999PatRe..32.1857L](https://ui.adsabs.harvard.edu/abs/1999PatRe..32.1857L). [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1016/S0031-3203(99)00010-2](https://doi.org/10.1016%2FS0031-3203%2899%2900010-2).

25. Rafael C. Gonzalez and Richard Eugene Woods (2008). *Digital Image Processing*, 3rd ed. Upper Saddle River, NJ: Prentice Hall. [ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier)) [0-13-168728-X](https://en.wikipedia.org/wiki/Special:BookSources/0-13-168728-X). [pp. 407–413](https://books.google.com/books?id=8uGOnjRGEzoC&pg=PA410&lpg=PA410).

26. Poynton (1997). ["What weighting of red, green and blue corresponds to brightness?"](https://www.poynton.com/notes/colour_and_gamma/ColorFAQ.html#RTFToC9)

27. Bruce Lindbloom (2001-09-25). [http://lists.apple.com/archives/colorsync-users/2001/Sep/msg00488.html](http://lists.apple.com/archives/colorsync-users/2001/Sep/msg00488.html) [Archived](https://web.archive.org/web/20110707173255/http://lists.apple.com/archives/colorsync-users/2001/Sep/msg00488.html) 2011-07-07 at the [Wayback Machine](https://en.wikipedia.org/wiki/Wayback_Machine) "Re: Luminosity channel...".

28. Cheng et al. (2001)

29. Tantek Çelik, Chris Lilley, and L. David Baron (July 2008). ["CSS3 Color Module Level 3"](https://www.w3.org/TR/2008/WD-css3-color-20080721/#hsl-color).

30. ["Working with color ramps"](https://webhelp.esri.com/arcgisdesktop/9.2/index.cfm?TopicName=Working_with_color_ramps). [Environmental Systems Research Institute](https://en.wikipedia.org/wiki/Environmental_Systems_Research_Institute). January 2008. Retrieved August 30, 2017.

31. Bradley, John (1994). ["The HSV Modification Tools"](http://www.trilon.com/xv/manual/xv-3.10a/color-editor-2.html). *John's World of XV and Other Cool Stuff*.

32. Sinkel, Kiril (January 2010). ["User Guide for Picture Window and Picture Window Pro Digital Light & Color"](https://web.archive.org/web/20140512231703/http://www.dl-c.com/Temp/downloads/PW%20Doc/PW70.pdf) (PDF). Archived from [the original](http://www.dl-c.com/Temp/downloads/PW%20Doc/PW70.pdf) (PDF) on 2014-05-12.

33. ["Blending Modes"](https://helpx.adobe.com/photoshop/using/blending-modes.html). *Photoshop User Guide*. Adobe Systems Incorporated. February 15, 2017.

34. ["Compositing and Blending Level 1"](https://www.w3.org/TR/compositing-1). *www.w3.org*.

35. ["GIMP's LCH Blend Modes"](https://ninedegreesbelow.com/photography/gimp-lch-blend-modes.html). *Nine Degrees Below*.

36. John Kender (1976). "Saturation, hue and normalized color". Carnegie Mellon University, Computer Science Dept. Pittsburgh, PA.

37. Yu-Ichi Ohta; Takeo Kanade; Toshiyuki Sakai (1980). "Color information for region segmentation". *Computer Graphics and Image Processing*. **13** (3): 222. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1016/0146-664X(80)90047-7](https://doi.org/10.1016%2F0146-664X%2880%2990047-7).

38. Ffrank Perez; Christof Koch (1994). ["Toward color image segmentation in analog VLSI: Algorithm and hardware"](https://authors.library.caltech.edu/40488/1/370338.pdf) (PDF). *International Journal of Computer Vision*. **12**: 17–42. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1007/BF01420983](https://doi.org/10.1007%2FBF01420983). [S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier)) [6140819](https://api.semanticscholar.org/CorpusID:6140819).

39. Brewer, Cynthia A. (1999). ["Color Use Guidelines for Data Representation"](https://web.archive.org/web/20090807105257/http://www.personal.psu.edu/cab38/ColorSch/ASApaper.html). *Proceedings of the Section on Statistical Graphics*. Alexandria, VA: American Statistical Association. pp. 55–60. Archived from [the original](http://www.personal.psu.edu/cab38/ColorSch/ASApaper.html) on 2009-08-07. Retrieved 2010-02-05.

40. Fisher, Nicholas (1993). [*Statistical Analysis of Circular Dat*](https://archive.org/details/statisticalanaly0000fish_v6v2/). Cambridge University Press. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1017/CBO9780511564345](https://doi.org/10.1017%2FCBO9780511564345). [ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier)) [978-0-521-35018-1](https://en.wikipedia.org/wiki/Special:BookSources/978-0-521-35018-1).

41. Hanbury, Allan (2003). *Circular Statistics Applied to Colour Images*. 8th Computer Vision Winter Workshop. [CiteSeerX](https://en.wikipedia.org/wiki/CiteSeerX_(identifier)) [10.1.1.4.1381](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.1381).

42. Poynton (1997). ["What are HSB and HLS?"](https://www.poynton.com/notes/colour_and_gamma/ColorFAQ.html#RTFToC36)

## Bibliography

- Agoston, Max K. (2005). [*Computer Graphics and Geometric Modeling: Implementation and Algorithms*](https://books.google.com/books?id=fGX8yC-4vXUC&pg=PA300). London: Springer. pp. 300–306. [ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier)) [978-1-85233-818-3](https://en.wikipedia.org/wiki/Special:BookSources/978-1-85233-818-3). Agoston's book contains a description of HSV and HSL, and algorithms in [pseudocode](https://en.wikipedia.org/wiki/Pseudocode) for converting to each from RGB, and back again.

- Cheng, Heng-Da; Jiang, Xihua; Sun, Angela; Wang, Jingli (2001). "Color image segmentation: Advances and prospects". *Pattern Recognition*. **34** (12): 2259. [Bibcode](https://en.wikipedia.org/wiki/Bibcode_(identifier)):[2001PatRe..34.2259C](https://ui.adsabs.harvard.edu/abs/2001PatRe..34.2259C). [CiteSeerX](https://en.wikipedia.org/wiki/CiteSeerX_(identifier)) [10.1.1.119.2886](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.119.2886). [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1016/S0031-3203(00)00149-7](https://doi.org/10.1016%2FS0031-3203%2800%2900149-7). [S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier)) [205904573](https://api.semanticscholar.org/CorpusID:205904573). This computer vision literature review briefly summarizes research in color image segmentation, including that using HSV and HSI representations.

- Fairchild, Mark D. (2005). [*Color Appearance Models*](http://www.cis.rit.edu/fairchild/CAM.html) (2nd ed.). Addison-Wesley. This book doesn't discuss HSL or HSV specifically, but is one of the most readable and precise resources about current color science.

- [Foley, J. D.](https://en.wikipedia.org/wiki/James_D._Foley); et al. (1995). [*Computer Graphics: Principles and Practice*](https://www.pearsonhighered.com/educator/academic/product/0,,0201848406,00%2Ben-USS_01DBC.html) (2nd ed.). Redwood City, CA: Addison-Wesley. [ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier)) [978-0-201-84840-3](https://en.wikipedia.org/wiki/Special:BookSources/978-0-201-84840-3). The standard computer graphics textbook of the 1990s, this tome has a chapter full of algorithms for converting between color models, in [C](https://en.wikipedia.org/wiki/C_(programming_language)).

- Hanbury, Allan; Serra, Jean (December 2002). *A 3D-polar Coordinate Colour Representation Suitable for Image Analysis*. Vienna, Austria: Vienna University of Technology. {{[cite book](https://en.wikipedia.org/wiki/Template:Cite_book)}}: |work= ignored ([help](https://en.wikipedia.org/wiki/Help:CS1_errors#periodical_ignored))

- Hanbury, Allan (2008). ["Constructing cylindrical coordinate colour spaces"](http://muscle.ercim.eu/images/DocumentPDF/Hanbury_PRL.pdf) (PDF). *Pattern Recognition Letters*. **29** (4): 494–500. [Bibcode](https://en.wikipedia.org/wiki/Bibcode_(identifier)):[2008PaReL..29..494H](https://ui.adsabs.harvard.edu/abs/2008PaReL..29..494H). [CiteSeerX](https://en.wikipedia.org/wiki/CiteSeerX_(identifier)) [10.1.1.211.6425](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.211.6425). [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1016/j.patrec.2007.11.002](https://doi.org/10.1016%2Fj.patrec.2007.11.002).

- Joblove, George H.; Greenberg, Donald (August 1978). ["Color spaces for computer graphics"](https://papers.cumincad.org/data/works/att/634c.content.pdf) (PDF). *[Computer Graphics](https://en.wikipedia.org/wiki/Computer_Graphics_(publication))*. **12** (3): 20–25. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/965139.807362](https://doi.org/10.1145%2F965139.807362). Joblove and Greenberg's paper was the first describing the HSL model, which it compares to HSV.

- Kuehni, Rolf G. (2003). *Color Space and Its Divisions: Color Order from Antiquity to the present*. New York: Wiley. [ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier)) [978-0-471-32670-0](https://en.wikipedia.org/wiki/Special:BookSources/978-0-471-32670-0). This book only briefly mentions HSL and HSV, but is a comprehensive description of color order systems through history.

- Levkowitz, Haim; Herman, Gabor T. (1993). "GLHS: A Generalized Lightness, Hue and Saturation Color Model". *[CVGIP: Graphical Models and Image Processing](https://en.wikipedia.org/wiki/CVGIP:_Graphical_Models_and_Image_Processing)*. **55** (4): 271–285. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1006/cgip.1993.1019](https://doi.org/10.1006%2Fcgip.1993.1019). This paper explains how both HSL and HSV, as well as other similar models, can be thought of as specific variants of a more general "GLHS" model. Levkowitz and Herman provide pseudocode for converting from RGB to GLHS and back.

- MacEvoy, Bruce (January 2010). ["Color Vision"](https://www.handprint.com/LS/CVS/color.html). *handprint.com*.. Especially the sections about ["Modern Color Models"](https://www.handprint.com/HP/WCL/color7.html) and ["Modern Color Theory"](https://www.handprint.com/HP/WCL/color18a.html). MacEvoy's extensive site about color science and paint mixing is one of the best resources on the web. On this page, he explains the color-making attributes, and the general goals and history of color order systems – including HSL and HSV – and their practical relevance to painters.

- Poynton, Charles (1997). ["Frequently Asked Questions About Color"](https://www.poynton.com/ColorFAQ.html). *poynton.com*. This self-published frequently asked questions page, by digital video expert Charles Poynton, explains, among other things, why in his opinion these models "are useless for the specification of accurate color", and should be abandoned in favor of more psychometrically relevant models.

- Poynton, Charles (2008). ["*YUV* and *luminance* considered harmful"](https://web.archive.org/web/20110608073957/https://poynton.com/papers/YUV_and_luminance_harmful.html). *poynton.com*. Archived from [the original](https://poynton.com/papers/YUV_and_luminance_harmful.html) on 2011-06-08. Retrieved August 30, 2017.

- [Smith, Alvy Ray](https://en.wikipedia.org/wiki/Alvy_Ray_Smith) (August 1978). ["Color gamut transform pairs"](https://doi.org/10.1145%2F965139.807361). *Computer Graphics*. **12** (3): 12–19. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/965139.807361](https://doi.org/10.1145%2F965139.807361). This is the original paper describing the "hexcone" model, HSV. Smith was a researcher at [NYIT](https://en.wikipedia.org/wiki/New_York_Institute_of_Technology)'s Computer Graphics Lab. He describes HSV's use in an early [digital painting](https://en.wikipedia.org/wiki/Raster_graphics) program.

## External links

- [Demonstrative color conversion applet](https://www.cs.rit.edu/~ncs/color/a_spaces.html)

- [HSV Colors](http://demonstrations.wolfram.com/HSVColors/) by Hector Zenil, [The Wolfram Demonstrations Project](https://en.wikipedia.org/wiki/The_Wolfram_Demonstrations_Project).

- [HSV to RGB](https://codebeautify.org/hsv-to-rgb-converter) by CodeBeautify.
