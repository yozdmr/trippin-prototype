# Design System Document: The "Organic Horizon" Paradigm

## 1. Overview & Creative North Star
**Creative North Star: The Living Itinerary**

This design system moves away from the rigid, grid-locked "utility app" feel. Instead, it adopts a **High-End Editorial** approach to travel planning. We treat the user's journey not as a list of tasks, but as a flowing narrative. 

The aesthetic is "Organic Minimalism"—a blend of spacious, breathy layouts and lush, botanical tones. We achieve a premium feel through **intentional asymmetry**, where images may bleed off-canvas or overlap containers, and **tonal layering**, which replaces harsh borders with soft transitions of light and shadow. The goal is to make the user feel as though they are leafing through a bespoke travel journal, not managing a spreadsheet.

---

## 2. Colors: A Verdant Spectrum
Our palette is rooted in the "Forest to Mint" transition. We use these tones to create a sense of growth and fresh air.

### The "No-Line" Rule
**Lines are a failure of hierarchy.** Within this system, 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts. To separate a hero section from a discovery feed, transition from `surface` (#f8faf8) to `surface-container-low` (#f2f4f2).

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper.
*   **Base:** `surface` (#f8faf8)
*   **Sectioning:** `surface-container-low` (#f2f4f2) for broad background areas.
*   **Interactive Containers:** `surface-container-highest` (#e1e3e1) for elements that require immediate user focus.

### The "Glass & Gradient" Rule
To escape the "flat" look, floating elements (like a bottom navigation bar or a "New Trip" FAB) must use **Glassmorphism**. Use `surface` at 80% opacity with a `backdrop-blur` of 20px. 
*   **Signature Textures:** For primary CTAs, apply a subtle linear gradient from `primary` (#154212) to `primary_container` (#2d5a27) at a 135-degree angle. This adds a "silken" depth that flat hex codes cannot replicate.

---

## 3. Typography: The Editorial Voice
We use a high-contrast pairing to balance authority with approachability.

*   **Display & Headlines (Plus Jakarta Sans):** Our "Voice." This typeface provides a modern, geometric clarity. Use `display-lg` for destination names to create a sense of scale. The generous x-height feels friendly yet premium.
*   **Body & Labels (Be Vietnam Pro):** Our "Information." This font is chosen for its exceptional legibility at small scales. Its slightly wider apertures ensure that even dense itineraries feel airy.

**Hierarchy Tip:** Use `headline-sm` in `primary` (#154212) for section titles, but pair it with `label-md` in `on_surface_variant` (#42493e) for metadata. This contrast in tone (dark green vs. muted grey) creates hierarchy without needing different font weights.

---

## 4. Elevation & Depth
In a nature-inspired system, depth should feel like natural light hitting a surface, not a computer-generated drop shadow.

*   **The Layering Principle:** Place a `surface_container_lowest` (#ffffff) card on a `surface_container` (#eceeec) background. The subtle 2-step jump in lightness creates a "soft lift" that feels architectural.
*   **Ambient Shadows:** If an element must "float" (e.g., a modal), use a shadow color of `on_surface` at 6% opacity, with a blur of `32px` and a Y-offset of `8px`. This mimics the soft shadow of a leaf on the ground.
*   **The Ghost Border Fallback:** If accessibility requirements demand a container edge, use a "Ghost Border": `outline_variant` (#c2c9bb) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), white text, `xl` (1.5rem) roundedness. 
*   **Secondary:** `surface_container_high` fill with `on_primary_fixed_variant` text. No border.
*   **Tertiary:** Pure text in `secondary` (#006e21) with a `label-md` uppercase styling.

### Cards & Lists
*   **The "No-Divider" Rule:** Never use horizontal lines to separate list items. Use `spacing-5` (1.7rem) of vertical whitespace or alternate the background color of list items between `surface` and `surface_container_low`.
*   **Collaborator Avatars:** Overlap avatars by `-0.5rem` to emphasize the "collaborative" nature of the app.

### Input Fields
*   **Text Inputs:** Use `surface_container_highest` as the background. Instead of a 4-sided border, use a 2px bottom-accent in `primary` only when the field is focused.
*   **Checkboxes:** Use `full` (9999px) roundedness for checkboxes to mimic the shape of a river stone, departing from the standard square.

### Travel-Specific Components
*   **The "Timeline Thread":** For the itinerary view, use a thick 4px vertical line in `primary_fixed` (#bcf0ae) that connects "stops," acting as the "road" from the brand icon.
*   **Weather/Mood Chips:** Use `tertiary_container` (#47551e) for environmental data (e.g., "Rainy," "Forest Hike") to differentiate travel logistics from travel "vibes."

---

## 6. Do's and Don'ts

### Do:
*   **Embrace White Space:** Use `spacing-12` (4rem) between major sections. If it feels "too empty," add more space.
*   **Asymmetric Imagery:** Place images with varying corner radii (e.g., Top-Left: `xl`, Bottom-Right: `sm`) to mimic organic, non-uniform shapes found in nature.
*   **Tonal Transitions:** Use `surface_tint` at 5% opacity as an overlay on images to make text overlays more legible while keeping the "green" soul of the brand.

### Don't:
*   **Don't use pure black (#000000):** Use `on_surface` (#191c1b) for all text to keep the palette soft.
*   **Don't use "Standard" Grids:** Avoid perfectly centered, boxy layouts. Shift a headline 1.4rem (`spacing-4`) to the left of the body text to create an editorial "rag."
*   **Don't use hard corners:** Never use `none` or `sm` roundedness unless for tiny utility icons. Everything should feel weathered and smooth, like a pebble. Use `lg` (1rem) as your baseline for cards.

---

**Director's Final Note:** This system is about the *feeling* of a trip—the breath of fresh air when you reach the trailhead. Every pixel should serve that calm, organized, and lush experience. If a design element feels "loud" or "heavy," strip it back until only the essence remains.**