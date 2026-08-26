/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export default {
  themes: ['github-dark-default'],
  useDarkModeMediaQuery: false,
  // Single theme: emit it as unscoped base styles instead of wrapping it in a
  // [data-theme=...] block that nothing on the page would ever match.
  themeCssSelector: false,
};
