/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export default {
  themes: ['github-dark-default', 'github-light-default'],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) =>
    `[data-theme="${theme.name.includes('dark') ? 'dark' : 'light'}"]`,
};
