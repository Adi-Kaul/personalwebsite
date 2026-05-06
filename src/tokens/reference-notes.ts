/*
Reference observations from https://www.abpartners.co, captured from the
rendered Next.js HTML, compiled CSS, and page JS chunks on 2026-05-03.

- Home slide backgrounds: most home feature panels render on
  .HomeFeature_feature__ECGzN { background-color: #25212e }. The "truth"
  slide ("The choice / I made.") overrides this with
  .HomeFeature_featureTruth__cE25u { background-color: #efae37 }. The global
  palette exposed by the page data also includes Tan #FCF0DA, Purple #25212E,
  Orange light #FFD3A6, Orange #CC502E, Green #245A52, and Green light #D1E5E3.
- Home foreground/text color: the home wrapper and feature content use #FCF0DA.
  Site-wide default text color in the global payload is #25212E on #FCF0DA.
- Serif headline font: .PageTitle_topLine__qO_rE computes to
  CaslonIonic, Georgia, Times, serif, font-weight 400, font-style normal.
  Project requirement maps this role to Playfair Display.
- Reference bottom headline line: .PageTitle_bottomLine__ny_SH uses
  GreycliffCF, Helvetica, Arial, sans-serif at font-weight 700. The requested
  Adi Kaul implementation intentionally uses Playfair Display for both lines.
- Large headline sizing: the top line is 2.625rem on mobile and
  clamp(16px, 6vw, 500px) from 992px up. At 1280px this computes to 76.8px;
  at 1440px it computes to 86.4px. The bottom line inherits h1 sizing,
  capped at 3.4375rem (55px) from 1200px up.
- Navigation logo/wordmark: the reference uses an SVG A-B logo, not live text.
  The desktop SVG width is 73px with viewBox 0 0 102 29. Its path fill is
  #FCF0DA on home slides, with transition: fill .1s ease-in-out. No
  letter-spacing or text-transform applies to the SVG logo. The nav marquee
  text is 13px and transitions color .1s ease-in-out.
- Horizontal slide movement: reference uses Swiper, not GSAP. The home Swiper
  config is slidesPerView: 1, loop: true, keyboard enabled, mousewheel
  sensitivity: 3, thresholdTime: .25, pagination bullets, lazy load, and
  speed: 800. No custom easing is declared; Swiper sets transform transition
  duration and relies on the browser/Swiper default timing. This implementation
  translates the observed 800ms movement into GSAP duration 0.8s and a close
  GSAP ease token, power2.inOut.
- Divider/line rule: .PageTitle_lineRule__zWN8c:after is width: 100%,
  display: block, height: 4px on mobile and 6px from 992px up. The observed
  home line color is #FCF0DA from the per-slide lineColor payload.
- Reference pagination: the site uses a horizontal progress-like strip, not
  circular dots. .Home_pagination__IYRHY is display:flex with 3px gap. Items
  are height: 3.44px, background #FCF0DA, opacity .6 inactive, opacity 1 when
  aria-current=true, positioned bottom: 32px on mobile. The requested site uses
  circular 8px dots while preserving the active/inactive opacity behavior.
- Scroll hint: text is "scroll to navigate"; it appears in the right-side
  button column on desktop only. The column has opacity .6, hint color #FCF0DA,
  p font-size 1.125rem, and span margin-right 5px. The requested site places
  "scroll ->" bottom-right.
*/

export const referenceNotes = {
  source: "https://www.abpartners.co",
  observedAt: "2026-05-03",
  transitionMs: 800,
  referenceSerif: "CaslonIonic, Georgia, Times, serif",
  referenceSans: "GreycliffCF, Helvetica, Arial, sans-serif",
  palette: {
    tan: "#FCF0DA",
    purple: "#25212E",
    orange: "#CC502E",
    orangeLight: "#FFD3A6",
    truthOrange: "#EFAE37",
    green: "#245A52",
    greenLight: "#D1E5E3"
  }
} as const;
