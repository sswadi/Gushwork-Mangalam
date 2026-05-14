# Mangalam HDPE — Product Landing Page

A responsive product page built with vanilla HTML, CSS and JavaScript. No frameworks or libraries.

---

## File Structure

```
project/
├── index.html        # Main HTML file
├── CSS/
│   └── style.css     # All styles
├── JS/
│   └── script.js     # All interactivity
└── Assets/           # Images, icons, SVGs
```

---

## Features

- **Sticky header** — slides in after scrolling past 25% of the viewport, hides on scroll up
- **Image gallery** — prev/next arrows, thumbnail strip, keyboard arrow navigation
- **Image zoom** — cursor-tracking magnifier on hover over the main product image
- **FAQ accordion** — single-open, animated expand/collapse
- **Process stepper** — tab chips on desktop, prev/next on mobile
- **Applications carousel** — horizontal scroll with arrow buttons
- **Sticky price bar** — appears when the hero price box scrolls out of view, hides at footer
- **Two modals**
  - Brochure modal → triggered by "Download Full Technical Datasheet", "Download PDF" buttons, "Request Catalogue"
  - Quote modal → triggered by "Request a Quote", "Get Custom Quote", "Talk to an Expert", "Contact Us"
- **Contact form** — client-side validation with success feedback

---

## Responsive Breakpoints

| Screen width | Top / Bottom | Left / Right                     |
| ------------ | ------------ | -------------------------------- |
| < 768px      | 48px         | 16px                             |
| ≥ 768px      | 80px         | 48px                             |
| ≥ 1024px     | 80px         | 60px                             |
| ≥ 1280px     | 100px        | 100px                            |
| ≥ 1600px     | 100px        | fluid (content capped at 1240px) |

---

## How to Run

Open `index.html` directly in a browser — no build step or server needed.

---

## Browser Support
