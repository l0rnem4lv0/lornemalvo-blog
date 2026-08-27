/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export default {
  themes: ['github-dark-default'],
  useDarkModeMediaQuery: false,
  // Single theme: emit it as unscoped base styles instead of wrapping it in a
  // [data-theme=...] block that nothing on the page would ever match.
  themeCssSelector: false,
  defaultProps: {
    // Every block renders as a plain code frame. Left to itself the frames
    // plugin promotes shell languages to a terminal frame, which adds a
    // titlebar with window dots and makes bash blocks look unlike every other
    // block. Set per block with frame="terminal" if one ever needs it back.
    frame: 'code',
  },
};
