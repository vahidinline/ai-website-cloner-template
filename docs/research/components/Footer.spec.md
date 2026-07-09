# Footer Specification

## Overview

- **Target file:** `src/components/Footer.tsx`
- **Interaction model:** static

## DOM Structure

- Footer container
  - Top CTA section (Cover block with background image and dark overlay)
    - Heading ("Download free chapters...")
    - Content group (Flex layout: Book covers image on left, list of features on right)
    - Form group (Email input and Download button)
  - Bottom Links section
    - Columns layout
      - Column 1 (35% width): Logo, Copyright text, Powered by text, Social links
      - Column 2: "About" heading, links list
      - Column 3: "Books" heading, links list
      - Column 4: "Podcast" heading, links list
    - Separator (hr)
    - Affiliate disclosure text

## Computed Styles (exact values from getComputedStyle)

### Top CTA Section

- minHeight: 430px
- padding: 115.2px 18px
- display: flex
- justifyContent: center
- alignItems: center
- position: relative
- Background image: `public/images/Footer-CTA-1024x476.jpg` (object-fit: cover)
- Overlay: absolute, background-color: rgb(0, 21, 35), opacity: 0.8

### Top CTA Inner Container

- maxWidth: 1200px
- padding: 0 48px

### Top CTA Heading

- fontSize: 56px
- fontWeight: 600
- fontFamily: "DM Sans", sans-serif
- lineHeight: 61.6px
- letterSpacing: -1.12px
- color: rgb(255, 255, 255)
- textAlign: center

### Top CTA Content Group (Books + List)

- maxWidth: 800px
- margin: 50px auto 0
- display: flex
- alignItems: center
- gap: 21.6px

### Top CTA List Items

- fontSize: 18px
- fontWeight: 500
- lineHeight: 28.8px
- color: rgb(255, 255, 255)

### Top CTA Form Group

- maxWidth: 800px
- margin: 50px auto 0

### Bottom Links Section

- paddingTop: 115.2px
- paddingBottom: 115.2px
- paddingLeft: 48px
- paddingRight: 48px
- maxWidth: 1440px
- margin: 0 auto

### Bottom Links Columns Container

- maxWidth: 1200px
- margin: 0 auto
- display: flex
- gap: 21.6px

### Column 1 (Logo & Info)

- width: 420px

### Text in Column 1

- fontSize: 15px
- fontWeight: 400
- lineHeight: 24px
- color: rgb(102, 115, 123)
- marginTop: 21.6px

### Social Links

- display: flex
- gap: 8px 21.6px
- marginTop: 21.6px
- Icons: width 24px, height 24px, color rgb(0, 21, 35), backgroundColor #F6F1F1, borderRadius 50%, padding 12px

### Columns 2, 3, 4 (Link Lists)

- width: 238px
- Heading: fontSize 16px, fontWeight 600, letterSpacing -0.32px, textTransform uppercase, padding 8px 0
- Links: fontSize 16px, fontWeight 500, lineHeight 25.6px

### Separator

- margin: 32px auto 0
- maxWidth: 1200px
- borderTop: 1px solid rgb(239, 233, 233)

### Affiliate Disclosure

- fontSize: 15px
- color: rgb(102, 115, 123)
- textAlign: center
- margin: 32px auto 0
- maxWidth: 800px

## States & Behaviors

- **Interaction model:** static

## Assets

- Background Image: `public/images/Footer-CTA-1024x476.jpg`
- Books Image: `public/images/tim-ferriss-4-hour-week-books.png`
- Dark Logo: `public/images/logo-dark.png`
- Social Icons: X, Instagram, YouTube, Facebook, LinkedIn, TikTok (extract from SVG output)

## Text Content

Top CTA:

- Heading: Download free chapters from The 4-Hour Workweek, the #1 New York Times bestseller.
- List 1: Free chapters of The 4-Hour Workweek, The 4-Hour Body, and The 4-Hour Chef.
- List 2: 5-Bullet Friday – books, gadgets, and weekly productivity tips and tricks.
- Form Placeholder: Your Email Address
- Button: Download Free Chapters

Bottom Info:

- Copyright © 2007–2026 Saeed Souzangar. All rights reserved. THE 4-HOUR® is a registered trademark of Saeed Souzangar.
- Proudly powered by WordPress / Hosted by Pressable.

About Links:

- Saeed Souzangar
- Contact
- Corrections
- Causes
- Media Kit and Samples
- Privacy Policy
- Terms of Service
- Do Not Sell or Share My Personal Information

Books Links:

- The 4-Hour Workweek
- The 4-Hour Body
- The 4-Hour Chef
- Tools of Titans
- Tribe of Mentors

Podcast Links:

- Popular Clips
- Podcast Sponsors
- The Random Show
- Meditation Monday

Bottom Disclosure:

- This site is an Amazon Associate, and purchases through Amazon links may earn an affiliate commission.

## Responsive Behavior

- **Desktop (1440px):** Full columns layout, flex rows for CTA content.
- **Tablet/Mobile:** CTA content stacks vertically (wrap-mobile). Bottom columns stack vertically. Form adjusts to full width.
