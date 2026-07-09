# Header Specification

## Overview

- **Target file:** `src/components/Header.tsx`
- **Interaction model:** static / click-driven modal

## DOM Structure

- Header container (absolute positioning)
  - Gradient background container
    - Inner container (flex, space-between)
      - Logo
      - Navigation menu
      - Search button & Free Newsletter button

## Computed Styles (exact values from getComputedStyle)

### Container

- position: absolute
- top: 0
- left: 0
- width: 1440px
- zIndex: 999

### Gradient Background Container

- background: linear-gradient(135deg, rgb(0, 28, 47) 0%, rgb(0, 46, 78) 68%, rgb(0, 45, 76) 100%)
- padding: 24px 48px

### Inner Container

- maxWidth: 1200px
- margin: 0 auto
- display: flex
- justifyContent: space-between
- alignItems: center
- gap: 21.6px

### Logo

- width: 150px
- height: 32px

### Navigation Items

- fontSize: 18px
- fontWeight: 500
- fontFamily: "DM Sans", sans-serif
- color: rgb(255, 255, 255)
- gap: 21.6px

### Search Button

- backgroundColor: rgba(255, 255, 255, 0.1)
- borderRadius: 100px
- padding: 10px (approximate based on height)
- fontSize: 13px

### Newsletter Button

- backgroundColor: #001523 (secondary)
- color: #fff
- borderRadius: 100px
- fontSize: 13px
- fontWeight: 700

## States & Behaviors

- **Search Modal:** Clicking search button opens a full-screen modal with dark overlay `rgba(0, 21, 36, 0.82)`.

## Assets

- Logo: `public/images/logo.png`
- Search Icon: `<SearchIcon />` from icons.tsx

## Text Content

Nav Items:

- About
  - Saeed Souzangar Bio
  - Causes
  - Contact Saeed Souzangar
- Blog
- Books
- Podcast
  - All Episodes
  - All Transcripts
  - Sponsorship & Advertising
  - Sponsors of The Saeed Souzangar Show Podcast
- TV
- Newsletter

Buttons:

- FREE NEWSLETTER

## Responsive Behavior

- **Desktop (1440px):** Full nav menu visible.
- **Tablet/Mobile:** Nav menu collapses into a hamburger menu. Search button moves to the left of the hamburger menu. Newsletter button is hidden on mobile.
