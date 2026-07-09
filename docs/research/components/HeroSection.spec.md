# Hero Section Specification

## Overview

- **Target file:** `src/components/HeroSection.tsx`
- **Interaction model:** static / slider (swiper)
- **Screenshot:** The main hero area below the header.

## DOM Structure

- Main container (Dark background)
  - Cover Block (with background image and dark overlay)
    - Inner container
      - Columns layout (2 columns)
        - Column 1: Slider wrapper
          - Swiper slider with quotes and review text
        - Column 2: Content wrapper
          - Image: Book covers
          - Right content:
            - "Get 175+ Free Pages" text
            - Form (Email input, Download button)

## Computed Styles (exact values from getComputedStyle)

### Main Container

- backgroundColor: rgb(0, 21, 35)
- width: 1440px
- position: relative

### Cover Block

- padding: 115.2px 18px 64px
- minHeight: 430px
- display: flex
- justifyContent: center
- alignItems: center
- position: relative
- Background Image: `public/images/hero-bg2-1-scaled.jpg`
- Overlay: rgb(43, 46, 49), opacity: 0.6

### Inner Container

- maxWidth: 1200px
- display: block

### Columns Layout

- display: flex
- gap: 21.6px

### Column 1 (Slider)

- width: 589.203px
- padding: 96px 0

### Column 2 (Content)

- width: 589.203px
- display: flex
- gap: 21.6px
- marginTop: 21.6px
- paddingTop: 32px
- alignItems: center

#### Book Covers Image Container

- width: 189px

#### Right Content Container

- width: 378px
- Text: fontSize 22px, fontWeight 600, lineHeight 30.8px, color rgb(255, 255, 255)
- Highlight text ("Get 175+ Free Pages"): color rgb(135, 206, 255)
- Form spacing: marginTop 21.6px
- Form layout: flex row, alignItems center, gap 8px

#### Form Elements

- Input: backgroundColor rgb(255, 255, 255), padding 6px, borderRadius 9999px
- Button: backgroundColor rgb(248, 196, 59), color rgb(0, 21, 35), padding 24px 24px 20px, borderRadius 9999px, fontWeight 600, fontSize 18px

## States & Behaviors

- **Slider:** Swiper component that cycles through quotes. Interaction: Auto-play or swipe.

## Assets

- Background Image: `public/images/hero-bg2-1-scaled.jpg`
- Book Covers: `public/images/tim-ferriss-4-hour-week-books-optmized.png`
- Media Logos (New York Times, Newsweek, Men's Journal): Extract from assets folder.

## Text Content

- Quotes in Slider:
  - "4,000+ 5-Star Reviews, Top-10 Highlighted Book of All Time."
  - "A cross between Jack Welch and a Buddhist monk."
  - "The world's best human guinea pig."
  - "The most surprising self-help hit of the decade."
- Right Content:
  - "Get 175+ Free Pages The 4-Hour Workweek The 4-Hour Body The 4-Hour Chef"
  - Form Placeholder: "Your Email Address"
  - Button text: "Download Free Chapters"

## Responsive Behavior

- **Desktop (1440px):** 2-column layout (Slider left, content right)
- **Tablet/Mobile:** Columns stack vertically. Slider is hidden on small screens (`block-visibility-hide-small-screen`). Form adjusts to full width or wraps.
